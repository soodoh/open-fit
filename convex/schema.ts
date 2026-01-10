import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Enum type definitions matching Prisma
const RoleEnum = v.union(v.literal("USER"), v.literal("ADMIN"));

const SetGroupTypeEnum = v.union(v.literal("NORMAL"), v.literal("SUPERSET"));

const SetTypeEnum = v.union(
  v.literal("NORMAL"),
  v.literal("WARMUP"),
  v.literal("DROPSET"),
  v.literal("FAILURE"),
);

const ExerciseForceEnum = v.union(
  v.literal("push"),
  v.literal("pull"),
  v.literal("static"),
);

const ExerciseLevelEnum = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("expert"),
);

const MuscleGroupEnum = v.union(
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
);

const ExerciseCategoryEnum = v.union(
  v.literal("strength"),
  v.literal("cardio"),
  v.literal("stretching"),
  v.literal("plyometrics"),
  v.literal("powerlifting"),
  v.literal("strongman"),
  v.literal("olympic_weightlifting"),
);

const ExerciseMechanicEnum = v.union(
  v.literal("compound"),
  v.literal("isolation"),
);

const EquipmentEnum = v.union(
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
);

export default defineSchema({
  // Include Convex Auth tables
  ...authTables,

  // Extended user profile (links to Convex Auth users table)
  userProfiles: defineTable({
    userId: v.id("users"), // References Convex Auth users table
    role: RoleEnum,
    defaultRepetitionUnitId: v.id("repetitionUnits"),
    defaultWeightUnitId: v.id("weightUnits"),
  }).index("by_user", ["userId"]),

  repetitionUnits: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  weightUnits: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  routines: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  routineDays: defineTable({
    routineId: v.id("routines"),
    userId: v.id("users"),
    weekdays: v.array(v.number()),
    description: v.string(),
    updatedAt: v.number(),
  })
    .index("by_routine", ["routineId"])
    .index("by_user", ["userId"])
    .searchIndex("search_description", {
      searchField: "description",
      filterFields: ["userId"],
    }),

  workoutSessions: defineTable({
    userId: v.id("users"),
    name: v.string(),
    notes: v.string(),
    impression: v.optional(v.number()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    templateId: v.optional(v.id("routineDays")),
  })
    .index("by_user", ["userId"])
    .index("by_user_start", ["userId", "startTime"])
    .index("by_template", ["templateId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),

  workoutSetGroups: defineTable({
    userId: v.id("users"),
    routineDayId: v.optional(v.id("routineDays")),
    sessionId: v.optional(v.id("workoutSessions")),
    type: SetGroupTypeEnum,
    order: v.number(),
    comment: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_routine_day", ["routineDayId", "order"])
    .index("by_session", ["sessionId", "order"])
    .index("by_user", ["userId"]),

  workoutSets: defineTable({
    userId: v.id("users"),
    setGroupId: v.id("workoutSetGroups"),
    exerciseId: v.id("exercises"),
    type: SetTypeEnum,
    order: v.number(),
    reps: v.number(),
    repetitionUnitId: v.id("repetitionUnits"),
    weight: v.number(),
    weightUnitId: v.id("weightUnits"),
    restTime: v.number(),
    completed: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_set_group", ["setGroupId", "order"])
    .index("by_exercise", ["exerciseId"])
    .index("by_user", ["userId"]),

  exercises: defineTable({
    name: v.string(),
    equipment: v.optional(EquipmentEnum),
    force: v.optional(ExerciseForceEnum),
    level: ExerciseLevelEnum,
    mechanic: v.optional(ExerciseMechanicEnum),
    primaryMuscles: v.array(MuscleGroupEnum),
    secondaryMuscles: v.array(MuscleGroupEnum),
    instructions: v.array(v.string()),
    category: ExerciseCategoryEnum,
    images: v.array(v.string()),
  })
    .index("by_name", ["name"])
    .searchIndex("search_exercise", {
      searchField: "name",
    }),
});
