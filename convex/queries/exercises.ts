import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

// Enum validators for filter arguments
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

const ExerciseLevelEnum = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("expert"),
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

// Search exercises by name with pagination and optional filters
export const search = query({
  args: {
    searchTerm: v.string(),
    paginationOpts: paginationOptsValidator,
    equipment: v.optional(EquipmentEnum),
    level: v.optional(ExerciseLevelEnum),
    category: v.optional(ExerciseCategoryEnum),
    primaryMuscle: v.optional(MuscleGroupEnum),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }

    const paginatedExercises = await ctx.db
      .query("exercises")
      .withSearchIndex("search_exercise", (q) => {
        let searchQuery = q.search("name", args.searchTerm);

        if (args.equipment !== undefined) {
          searchQuery = searchQuery.eq("equipment", args.equipment);
        }
        if (args.level !== undefined) {
          searchQuery = searchQuery.eq("level", args.level);
        }
        if (args.category !== undefined) {
          searchQuery = searchQuery.eq("category", args.category);
        }

        return searchQuery;
      })
      .paginate(args.paginationOpts);

    // Apply client-side filtering for primaryMuscle (array field)
    if (args.primaryMuscle !== undefined) {
      const filteredPage = paginatedExercises.page.filter((exercise) =>
        exercise.primaryMuscles.includes(args.primaryMuscle!),
      );
      return {
        ...paginatedExercises,
        page: filteredPage,
      };
    }

    return paginatedExercises;
  },
});

// Get count of exercises matching search term
export const searchCount = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return 0;
    }

    const results = await ctx.db
      .query("exercises")
      .withSearchIndex("search_exercise", (q) =>
        q.search("name", args.searchTerm),
      )
      .collect();

    return results.length;
  },
});

// List exercises with pagination and optional filters (sorted by name ascending)
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    equipment: v.optional(EquipmentEnum),
    level: v.optional(ExerciseLevelEnum),
    category: v.optional(ExerciseCategoryEnum),
    primaryMuscle: v.optional(MuscleGroupEnum),
  },
  handler: async (ctx, args) => {
    const paginatedExercises = await ctx.db
      .query("exercises")
      .withIndex("by_name")
      .order("asc")
      .paginate(args.paginationOpts);

    // Apply client-side filtering (since regular indexes don't support multiple filter fields)
    const hasFilters =
      args.equipment !== undefined ||
      args.level !== undefined ||
      args.category !== undefined ||
      args.primaryMuscle !== undefined;

    if (hasFilters) {
      const filteredPage = paginatedExercises.page.filter((exercise) => {
        if (args.equipment !== undefined && exercise.equipment !== args.equipment) {
          return false;
        }
        if (args.level !== undefined && exercise.level !== args.level) {
          return false;
        }
        if (args.category !== undefined && exercise.category !== args.category) {
          return false;
        }
        if (args.primaryMuscle !== undefined && !exercise.primaryMuscles.includes(args.primaryMuscle)) {
          return false;
        }
        return true;
      });
      return {
        ...paginatedExercises,
        page: filteredPage,
      };
    }

    return paginatedExercises;
  },
});

// Simple search for autocomplete (returns array, not paginated)
export const searchSimple = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return [];
    }

    const results = await ctx.db
      .query("exercises")
      .withSearchIndex("search_exercise", (q) =>
        q.search("name", args.searchTerm),
      )
      .take(20);

    return results;
  },
});

// Get total count of exercises
export const count = query({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db.query("exercises").collect();
    return exercises.length;
  },
});

// Get a single exercise by ID
export const get = query({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    const exercise = await ctx.db.get(args.id);
    return exercise;
  },
});
