import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUserId } from "../lib/auth";

// List all routines for the current user with routine days
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);

    // Get routines ordered by most recently updated
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Fetch related routine days for each routine
    const routinesWithDays = await Promise.all(
      routines.map(async (routine) => {
        const routineDays = await ctx.db
          .query("routineDays")
          .withIndex("by_routine", (q) => q.eq("routineId", routine._id))
          .collect();

        return {
          ...routine,
          routineDays,
        };
      }),
    );

    return routinesWithDays;
  },
});

// Get a single routine by ID
export const get = query({
  args: { id: v.id("routines") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const routine = await ctx.db.get(args.id);

    if (!routine) {
      return null;
    }

    // Check ownership
    if (routine.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Fetch routine days
    const routineDays = await ctx.db
      .query("routineDays")
      .withIndex("by_routine", (q) => q.eq("routineId", args.id))
      .collect();

    return {
      ...routine,
      routineDays,
    };
  },
});
