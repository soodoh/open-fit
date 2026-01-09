import { query } from "../_generated/server";
import { getAuthenticatedUserId } from "../lib/auth";

// Get the current user's profile with units data
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);

    // Get user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // Get all units for the dropdowns
    const repetitionUnits = await ctx.db.query("repetitionUnits").collect();
    const weightUnits = await ctx.db.query("weightUnits").collect();

    return {
      profile,
      repetitionUnits,
      weightUnits,
    };
  },
});
