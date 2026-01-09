import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

// Search exercises by name with cursor-based pagination
// Note: Convex search indexes don't support .paginate(), so we implement manual cursor pagination
export const search = query({
  args: {
    searchTerm: v.string(),
    cursor: v.optional(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.searchTerm.trim()) {
      return {
        page: [],
        isDone: true,
        continueCursor: null as string | null,
        totalCount: 0,
      };
    }

    // Fetch more results than needed to determine if there are more pages
    const maxResults = 500;
    const allResults = await ctx.db
      .query("exercises")
      .withSearchIndex("search_exercise", (q) =>
        q.search("name", args.searchTerm),
      )
      .take(maxResults);

    // If we have a cursor, find the starting position
    let startIndex = 0;
    if (args.cursor) {
      const cursorIndex = allResults.findIndex((r) => r._id === args.cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    // Get the page of results
    const pageResults = allResults.slice(
      startIndex,
      startIndex + args.numItems,
    );
    const hasMore = startIndex + args.numItems < allResults.length;

    return {
      page: pageResults,
      isDone: !hasMore,
      continueCursor:
        hasMore && pageResults.length > 0
          ? pageResults[pageResults.length - 1]._id
          : null,
      totalCount: allResults.length,
    };
  },
});

// List exercises with pagination
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const paginatedExercises = await ctx.db
      .query("exercises")
      .withIndex("by_name")
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
