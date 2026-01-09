import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

// Search exercises by name with pagination
export const search = query({
  args: {
    searchTerm: v.string(),
    paginationOpts: paginationOptsValidator,
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
      .withSearchIndex("search_exercise", (q) =>
        q.search("name", args.searchTerm),
      )
      .paginate(args.paginationOpts);

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

// List exercises with pagination (sorted by name descending)
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const paginatedExercises = await ctx.db
      .query("exercises")
      .withIndex("by_name")
      .order("asc")
      .paginate(args.paginationOpts);

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
