import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction, internalMutation } from "./_generated/server";
import {
  type RawExercise,
  exercises as rawExercises,
} from "./seedData/exercises";
import type { Id } from "./_generated/dataModel";

// ============================================================================
// Public Actions (run from CLI)
// ============================================================================

/**
 * Seed the database with exercises and units.
 * Run: pnpm convex run seed:run
 */
export const run = action({
  args: {},
  handler: async (
    ctx,
  ): Promise<{
    success: boolean;
    exercisesSeeded: number;
    repUnitsSeeded: number;
    weightUnitsSeeded: number;
  }> => {
    return await ctx.runAction(internal.seed.seedDatabase, {});
  },
});

/**
 * Seed mock user data (routines, days, sets) for testing.
 * Run: pnpm convex run seed:mockUserData '{"email": "your@email.com"}'
 */
export const mockUserData = action({
  args: { email: v.string() },
  handler: async (
    ctx,
    { email },
  ): Promise<{
    success: boolean;
    routines: number;
    routineDays: number;
    setGroups: number;
    sets: number;
    workoutSessions: number;
  }> => {
    // Find user by email
    const userId = await ctx.runMutation(internal.seed.findUserByEmail, {
      email,
    });

    if (!userId) {
      throw new Error(`User with email "${email}" not found`);
    }

    return await ctx.runAction(internal.seed.seedMockData, { userId });
  },
});

// ============================================================================
// Internal Actions
// ============================================================================

// MuscleGroup type for transformed muscles (matching schema)
type MuscleGroup =
  | "abdominals"
  | "chest"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "adductors"
  | "abductors"
  | "calves"
  | "forearms"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "traps"
  | "lats"
  | "middle_back"
  | "lower_back"
  | "neck";

// Equipment type matching schema
type Equipment =
  | "body_only"
  | "machine"
  | "cable"
  | "foam_roll"
  | "dumbbell"
  | "barbell"
  | "ez_curl_bar"
  | "kettlebells"
  | "medicine_ball"
  | "exercise_ball"
  | "bands"
  | "other";

// Helper function to transform exercise data to match schema
function transformExercise(exercise: RawExercise) {
  const equipmentMap: Record<string, Equipment> = {
    "body only": "body_only",
    "e-z curl bar": "ez_curl_bar",
    "medicine ball": "medicine_ball",
    "exercise ball": "exercise_ball",
    "foam roll": "foam_roll",
  };

  const transformMuscle = (muscle: string): MuscleGroup =>
    muscle.replace(" ", "_") as MuscleGroup;

  const transformEquipment = (
    equipment: RawExercise["equipment"],
  ): Equipment | undefined => {
    if (!equipment) return undefined;
    return equipmentMap[equipment] ?? (equipment as Equipment);
  };

  return {
    name: exercise.name,
    equipment: transformEquipment(exercise.equipment),
    force: exercise.force || undefined,
    level: exercise.level,
    mechanic: exercise.mechanic || undefined,
    primaryMuscles: exercise.primaryMuscles.map(transformMuscle),
    secondaryMuscles: exercise.secondaryMuscles.map(transformMuscle),
    instructions: exercise.instructions,
    category:
      exercise.category === "olympic weightlifting"
        ? ("olympic_weightlifting" as const)
        : exercise.category,
    images: exercise.images,
  };
}

export const seedDatabase = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("Starting database seed...");

    // 1. Seed repetition units
    console.log("Seeding repetition units...");
    const repUnits = [
      "Repetitions",
      "Seconds",
      "Minutes",
      "Miles",
      "Kilometers",
    ];

    for (const name of repUnits) {
      await ctx.runMutation(internal.seed.createRepetitionUnit, { name });
      console.log(`Created repetition unit: ${name}`);
    }

    // 2. Seed weight units
    console.log("Seeding weight units...");
    const weightUnits = ["lb", "kg", "Body Weight"];

    for (const name of weightUnits) {
      await ctx.runMutation(internal.seed.createWeightUnit, { name });
      console.log(`Created weight unit: ${name}`);
    }

    // 3. Seed exercises
    console.log(`Seeding ${rawExercises.length} exercises...`);
    let count = 0;

    for (const exercise of rawExercises) {
      try {
        const transformed = transformExercise(exercise);
        await ctx.runMutation(internal.seed.createExercise, transformed);
        count++;

        if (count % 50 === 0) {
          console.log(`Seeded ${count} exercises...`);
        }
      } catch (error) {
        console.error(`Failed to seed exercise ${exercise.name}:`, error);
      }
    }

    console.log(
      `Database seeding complete! Seeded ${count} exercises, ${repUnits.length} repetition units, ${weightUnits.length} weight units.`,
    );

    return {
      success: true,
      exercisesSeeded: count,
      repUnitsSeeded: repUnits.length,
      weightUnitsSeeded: weightUnits.length,
    };
  },
});

const NUM_ROUTINES = 50;
const NUM_SET_GROUPS = 10;
const NUM_SETS = 4;
const NUM_WORKOUT_SESSIONS = 100;

export const seedMockData = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    console.log("Starting mock data seed...");

    // Get default units
    const units = await ctx.runMutation(internal.seed.getDefaultUnits, {});
    if (!units.repUnitId || !units.weightUnitId) {
      throw new Error(
        "Default units not found. Run `pnpm convex run seed:run` first.",
      );
    }

    // Get all exercises for random selection
    const exercises = await ctx.runMutation(internal.seed.getAllExercises, {});
    if (exercises.length === 0) {
      throw new Error(
        "No exercises found. Run `pnpm convex run seed:run` first.",
      );
    }

    console.log(`Creating ${NUM_ROUTINES} routines...`);

    let firstRoutineDayId: Id<"routineDays"> | null = null;

    for (let i = 1; i <= NUM_ROUTINES; i++) {
      // Create routine
      const routineId = await ctx.runMutation(internal.seed.createRoutine, {
        userId,
        name: `Routine ${i}`,
        description: `This is routine number ${i}`,
      });

      // Create 2 routine days per routine
      const day1Id = await ctx.runMutation(internal.seed.createRoutineDay, {
        userId,
        routineId,
        description: `Day 1 of Routine ${i}`,
        weekdays: [1, 3],
      });

      // Store the first routine day ID for workout sessions
      if (i === 1) {
        firstRoutineDayId = day1Id;
      }

      const day2Id = await ctx.runMutation(internal.seed.createRoutineDay, {
        userId,
        routineId,
        description: `Day 2 of Routine ${i}`,
        weekdays: [2, 4],
      });

      // Create set groups and sets for each day
      for (const dayId of [day1Id, day2Id]) {
        for (let j = 1; j <= NUM_SET_GROUPS; j++) {
          // Pick a random exercise
          const randomExercise =
            exercises[Math.floor(Math.random() * exercises.length)];

          const setGroupId = await ctx.runMutation(
            internal.seed.createSetGroup,
            {
              userId,
              routineDayId: dayId,
              order: j,
            },
          );

          // Create sets for this set group
          for (let k = 1; k <= NUM_SETS; k++) {
            await ctx.runMutation(internal.seed.createSet, {
              userId,
              setGroupId,
              exerciseId: randomExercise._id,
              order: k,
              repetitionUnitId: units.repUnitId,
              weightUnitId: units.weightUnitId,
            });
          }
        }
      }

      if (i % 10 === 0) {
        console.log(`Created ${i} routines...`);
      }
    }

    // Get the template (first routine day) set groups and sets
    if (!firstRoutineDayId) {
      throw new Error("firstRoutineDayId should have been set in the loop");
    }

    const templateSetGroups = await ctx.runMutation(
      internal.seed.getSetGroupsWithSets,
      { routineDayId: firstRoutineDayId },
    );

    // Create workout sessions based on the first routine day template
    console.log(`Creating ${NUM_WORKOUT_SESSIONS} workout sessions...`);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    for (let i = 1; i <= NUM_WORKOUT_SESSIONS; i++) {
      // Create session with dates spread over the past 100 days
      const startTime = now - (NUM_WORKOUT_SESSIONS - i) * oneDay;
      const endTime = startTime + 60 * 60 * 1000; // 1 hour workout

      const sessionId = await ctx.runMutation(
        internal.seed.createWorkoutSession,
        {
          userId,
          name: `Workout Session ${i}`,
          notes: `Notes for workout session ${i}`,
          impression: Math.floor(Math.random() * 5) + 1, // Random 1-5
          startTime,
          endTime,
          templateId: firstRoutineDayId,
        },
      );

      // Create set groups and sets for this session based on template
      for (const templateGroup of templateSetGroups) {
        const sessionSetGroupId = await ctx.runMutation(
          internal.seed.createSessionSetGroup,
          {
            userId,
            sessionId,
            type: templateGroup.type,
            order: templateGroup.order,
          },
        );

        // Create sets with mock weight and rep values
        for (const templateSet of templateGroup.sets) {
          // Generate realistic mock values
          const mockWeight = Math.floor(Math.random() * 200) + 20; // 20-220 lbs
          const mockReps = Math.floor(Math.random() * 10) + 5; // 5-15 reps

          await ctx.runMutation(internal.seed.createSessionSet, {
            userId,
            setGroupId: sessionSetGroupId,
            exerciseId: templateSet.exerciseId,
            type: templateSet.type,
            order: templateSet.order,
            reps: mockReps,
            repetitionUnitId: units.repUnitId,
            weight: mockWeight,
            weightUnitId: units.weightUnitId,
            restTime: 90, // 90 seconds rest
            completed: true,
          });
        }
      }

      if (i % 10 === 0) {
        console.log(`Created ${i} workout sessions...`);
      }
    }

    const totalSetGroups = NUM_ROUTINES * 2 * NUM_SET_GROUPS;
    const totalSets = totalSetGroups * NUM_SETS;

    console.log(`Mock data seeding complete!`);
    console.log(`- ${NUM_ROUTINES} routines`);
    console.log(`- ${NUM_ROUTINES * 2} routine days`);
    console.log(`- ${totalSetGroups} set groups`);
    console.log(`- ${totalSets} sets`);
    console.log(`- ${NUM_WORKOUT_SESSIONS} workout sessions`);

    return {
      success: true,
      routines: NUM_ROUTINES,
      routineDays: NUM_ROUTINES * 2,
      setGroups: totalSetGroups,
      sets: totalSets,
      workoutSessions: NUM_WORKOUT_SESSIONS,
    };
  },
});

// ============================================================================
// Internal Mutations
// ============================================================================

export const findUserByEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const account = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("providerAccountId"), email))
      .first();

    return account?.userId ?? null;
  },
});

export const getDefaultUnits = internalMutation({
  args: {},
  handler: async (ctx) => {
    const repUnit = await ctx.db
      .query("repetitionUnits")
      .withIndex("by_name", (q) => q.eq("name", "Repetitions"))
      .first();

    const weightUnit = await ctx.db
      .query("weightUnits")
      .withIndex("by_name", (q) => q.eq("name", "lb"))
      .first();

    return {
      repUnitId: repUnit?._id,
      weightUnitId: weightUnit?._id,
    };
  },
});

export const getAllExercises = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exercises").collect();
  },
});

export const createRepetitionUnit = internalMutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("repetitionUnits")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("repetitionUnits", args);
  },
});

export const createWeightUnit = internalMutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("weightUnits")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("weightUnits", args);
  },
});

export const createExercise = internalMutation({
  args: {
    name: v.string(),
    equipment: v.optional(
      v.union(
        v.literal("body_only"),
        v.literal("machine"),
        v.literal("cable"),
        v.literal("foam_roll"),
        v.literal("dumbbell"),
        v.literal("barbell"),
        v.literal("ez_curl_bar"),
        v.literal("kettlebells"),
        v.literal("medicine_ball"),
        v.literal("exercise_ball"),
        v.literal("bands"),
        v.literal("other"),
      ),
    ),
    force: v.optional(
      v.union(v.literal("push"), v.literal("pull"), v.literal("static")),
    ),
    level: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("expert"),
    ),
    mechanic: v.optional(
      v.union(v.literal("compound"), v.literal("isolation")),
    ),
    primaryMuscles: v.array(
      v.union(
        v.literal("abdominals"),
        v.literal("chest"),
        v.literal("quadriceps"),
        v.literal("hamstrings"),
        v.literal("glutes"),
        v.literal("adductors"),
        v.literal("abductors"),
        v.literal("calves"),
        v.literal("forearms"),
        v.literal("shoulders"),
        v.literal("biceps"),
        v.literal("triceps"),
        v.literal("traps"),
        v.literal("lats"),
        v.literal("middle_back"),
        v.literal("lower_back"),
        v.literal("neck"),
      ),
    ),
    secondaryMuscles: v.array(
      v.union(
        v.literal("abdominals"),
        v.literal("chest"),
        v.literal("quadriceps"),
        v.literal("hamstrings"),
        v.literal("glutes"),
        v.literal("adductors"),
        v.literal("abductors"),
        v.literal("calves"),
        v.literal("forearms"),
        v.literal("shoulders"),
        v.literal("biceps"),
        v.literal("triceps"),
        v.literal("traps"),
        v.literal("lats"),
        v.literal("middle_back"),
        v.literal("lower_back"),
        v.literal("neck"),
      ),
    ),
    instructions: v.array(v.string()),
    category: v.union(
      v.literal("strength"),
      v.literal("cardio"),
      v.literal("stretching"),
      v.literal("plyometrics"),
      v.literal("powerlifting"),
      v.literal("strongman"),
      v.literal("olympic_weightlifting"),
    ),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("exercises")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("exercises", args);
  },
});

export const createRoutine = internalMutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("routines", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      updatedAt: Date.now(),
    });
  },
});

export const createRoutineDay = internalMutation({
  args: {
    userId: v.id("users"),
    routineId: v.id("routines"),
    description: v.string(),
    weekdays: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("routineDays", {
      userId: args.userId,
      routineId: args.routineId,
      description: args.description,
      weekdays: args.weekdays,
      updatedAt: Date.now(),
    });
  },
});

export const createSetGroup = internalMutation({
  args: {
    userId: v.id("users"),
    routineDayId: v.id("routineDays"),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutSetGroups", {
      userId: args.userId,
      routineDayId: args.routineDayId,
      type: "NORMAL",
      order: args.order,
      updatedAt: Date.now(),
    });
  },
});

export const createSet = internalMutation({
  args: {
    userId: v.id("users"),
    setGroupId: v.id("workoutSetGroups"),
    exerciseId: v.id("exercises"),
    order: v.number(),
    repetitionUnitId: v.id("repetitionUnits"),
    weightUnitId: v.id("weightUnits"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutSets", {
      userId: args.userId,
      setGroupId: args.setGroupId,
      exerciseId: args.exerciseId,
      type: "NORMAL",
      order: args.order,
      reps: 0,
      repetitionUnitId: args.repetitionUnitId,
      weight: 0,
      weightUnitId: args.weightUnitId,
      restTime: 0,
      completed: false,
      updatedAt: Date.now(),
    });
  },
});

export const getSetGroupsWithSets = internalMutation({
  args: { routineDayId: v.id("routineDays") },
  handler: async (ctx, { routineDayId }) => {
    const setGroups = await ctx.db
      .query("workoutSetGroups")
      .withIndex("by_routine_day", (q) => q.eq("routineDayId", routineDayId))
      .collect();

    const result = [];
    for (const group of setGroups) {
      const sets = await ctx.db
        .query("workoutSets")
        .withIndex("by_set_group", (q) => q.eq("setGroupId", group._id))
        .collect();

      result.push({
        ...group,
        sets: sets.map((s) => ({
          exerciseId: s.exerciseId,
          type: s.type,
          order: s.order,
        })),
      });
    }

    return result;
  },
});

export const createWorkoutSession = internalMutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    notes: v.string(),
    impression: v.optional(v.number()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    templateId: v.optional(v.id("routineDays")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutSessions", {
      userId: args.userId,
      name: args.name,
      notes: args.notes,
      impression: args.impression,
      startTime: args.startTime,
      endTime: args.endTime,
      templateId: args.templateId,
    });
  },
});

export const createSessionSetGroup = internalMutation({
  args: {
    userId: v.id("users"),
    sessionId: v.id("workoutSessions"),
    type: v.union(v.literal("NORMAL"), v.literal("SUPERSET")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutSetGroups", {
      userId: args.userId,
      sessionId: args.sessionId,
      type: args.type,
      order: args.order,
      updatedAt: Date.now(),
    });
  },
});

export const createSessionSet = internalMutation({
  args: {
    userId: v.id("users"),
    setGroupId: v.id("workoutSetGroups"),
    exerciseId: v.id("exercises"),
    type: v.union(
      v.literal("NORMAL"),
      v.literal("WARMUP"),
      v.literal("DROPSET"),
      v.literal("FAILURE"),
    ),
    order: v.number(),
    reps: v.number(),
    repetitionUnitId: v.id("repetitionUnits"),
    weight: v.number(),
    weightUnitId: v.id("weightUnits"),
    restTime: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutSets", {
      userId: args.userId,
      setGroupId: args.setGroupId,
      exerciseId: args.exerciseId,
      type: args.type,
      order: args.order,
      reps: args.reps,
      repetitionUnitId: args.repetitionUnitId,
      weight: args.weight,
      weightUnitId: args.weightUnitId,
      restTime: args.restTime,
      completed: args.completed,
      updatedAt: Date.now(),
    });
  },
});
