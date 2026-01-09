import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthenticatedUserId } from "../lib/auth";

// List routines for the current user with pagination
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    // Get routines ordered by most recently updated with pagination
    const paginatedRoutines = await ctx.db
      .query("routines")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    // Fetch related routine days for each routine in the page
    const routinesWithDays = await Promise.all(
      paginatedRoutines.page.map(async (routine) => {
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

    return {
      ...paginatedRoutines,
      page: routinesWithDays,
    };
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
