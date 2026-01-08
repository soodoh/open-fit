import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalAction, internalMutation } from "./_generated/server";
import { exercises as rawExercises } from "./seedData/exercises";

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

// Helper function to transform exercise data to match schema
function transformExercise(exercise: any) {
  const equipmentMap: Record<string, string> = {
    "body only": "body_only",
    "e-z curl bar": "ez_curl_bar",
    "medicine ball": "medicine_ball",
    "exercise ball": "exercise_ball",
    "foam roll": "foam_roll",
  };

  const transformMuscle = (muscle: string) => muscle.replace(" ", "_") as any;

  return {
    name: exercise.name,
    equipment: exercise.equipment
      ? equipmentMap[exercise.equipment] || exercise.equipment
      : undefined,
    force: exercise.force || undefined,
    level: exercise.level,
    mechanic: exercise.mechanic || undefined,
    primaryMuscles: exercise.primaryMuscles.map(transformMuscle),
    secondaryMuscles: exercise.secondaryMuscles.map(transformMuscle),
    instructions: exercise.instructions,
    category:
      exercise.category === "olympic weightlifting"
        ? "olympic_weightlifting"
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

    const totalSetGroups = NUM_ROUTINES * 2 * NUM_SET_GROUPS;
    const totalSets = totalSetGroups * NUM_SETS;

    console.log(`Mock data seeding complete!`);
    console.log(`- ${NUM_ROUTINES} routines`);
    console.log(`- ${NUM_ROUTINES * 2} routine days`);
    console.log(`- ${totalSetGroups} set groups`);
    console.log(`- ${totalSets} sets`);

    return {
      success: true,
      routines: NUM_ROUTINES,
      routineDays: NUM_ROUTINES * 2,
      setGroups: totalSetGroups,
      sets: totalSets,
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
    primaryMuscles: v.array(v.any()),
    secondaryMuscles: v.array(v.any()),
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
