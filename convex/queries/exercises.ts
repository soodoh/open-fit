import { v } from "convex/values";
import { query } from "../_generated/server";

// Search exercises by name
export const search = query({
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

// Get all exercises (for admin/management purposes)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const exercises = await ctx.db.query("exercises").collect();
    return exercises;
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
