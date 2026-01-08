import { query } from "@/convex/_generated/server";
import { getAuthenticatedUserId, getOptionalUserId } from "@/convex/lib/auth";
import { v } from "convex/values";

// List all workout sessions for the current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);

    // Get sessions ordered by most recent start time
    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_start", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Fetch set groups with sets and exercises for each session
    const sessionsWithData = await Promise.all(
      sessions.map(async (session) => {
        const setGroups = await ctx.db
          .query("workoutSetGroups")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect();

        // Sort by order
        setGroups.sort((a, b) => a.order - b.order);

        // Fetch sets for each set group
        const setGroupsWithSets = await Promise.all(
          setGroups.map(async (group) => {
            const sets = await ctx.db
              .query("workoutSets")
              .withIndex("by_set_group", (q) => q.eq("setGroupId", group._id))
              .collect();

            sets.sort((a, b) => a.order - b.order);

            // Fetch exercise and units for each set
            const setsWithData = await Promise.all(
              sets.map(async (set) => {
                const exercise = await ctx.db.get(set.exerciseId);
                const repetitionUnit = await ctx.db.get(set.repetitionUnitId);
                const weightUnit = await ctx.db.get(set.weightUnitId);

                return {
                  ...set,
                  exercise,
                  repetitionUnit,
                  weightUnit,
                };
              }),
            );

            return {
              ...group,
              sets: setsWithData,
            };
          }),
        );

        return {
          ...session,
          setGroups: setGroupsWithSets,
        };
      }),
    );

    return sessionsWithData;
  },
});

// Get a single workout session by ID
export const get = query({
  args: { id: v.id("workoutSessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const session = await ctx.db.get(args.id);

    if (!session) {
      return null;
    }

    // Check ownership
    if (session.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Fetch set groups with sets and exercises
    const setGroups = await ctx.db
      .query("workoutSetGroups")
      .withIndex("by_session", (q) => q.eq("sessionId", args.id))
      .collect();

    setGroups.sort((a, b) => a.order - b.order);

    const setGroupsWithSets = await Promise.all(
      setGroups.map(async (group) => {
        const sets = await ctx.db
          .query("workoutSets")
          .withIndex("by_set_group", (q) => q.eq("setGroupId", group._id))
          .collect();

        sets.sort((a, b) => a.order - b.order);

        const setsWithData = await Promise.all(
          sets.map(async (set) => {
            const exercise = await ctx.db.get(set.exerciseId);
            const repetitionUnit = await ctx.db.get(set.repetitionUnitId);
            const weightUnit = await ctx.db.get(set.weightUnitId);

            return {
              ...set,
              exercise,
              repetitionUnit,
              weightUnit,
            };
          }),
        );

        return {
          ...group,
          sets: setsWithData,
        };
      }),
    );

    return {
      ...session,
      setGroups: setGroupsWithSets,
    };
  },
});

// Get the current active session (one without an endTime)
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getOptionalUserId(ctx);
    if (!userId) {
      return null;
    }

    // Find most recent session without endTime
    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Filter to sessions without endTime and get the most recent
    const activeSessions = sessions
      .filter((s) => !s.endTime)
      .sort((a, b) => b.startTime - a.startTime);

    if (activeSessions.length === 0) {
      return null;
    }

    const session = activeSessions[0];

    // Fetch set groups with sets and exercises
    const setGroups = await ctx.db
      .query("workoutSetGroups")
      .withIndex("by_session", (q) => q.eq("sessionId", session._id))
      .collect();

    setGroups.sort((a, b) => a.order - b.order);

    const setGroupsWithSets = await Promise.all(
      setGroups.map(async (group) => {
        const sets = await ctx.db
          .query("workoutSets")
          .withIndex("by_set_group", (q) => q.eq("setGroupId", group._id))
          .collect();

        sets.sort((a, b) => a.order - b.order);

        const setsWithData = await Promise.all(
          sets.map(async (set) => {
            const exercise = await ctx.db.get(set.exerciseId);
            const repetitionUnit = await ctx.db.get(set.repetitionUnitId);
            const weightUnit = await ctx.db.get(set.weightUnitId);

            return {
              ...set,
              exercise,
              repetitionUnit,
              weightUnit,
            };
          }),
        );

        return {
          ...group,
          sets: setsWithData,
        };
      }),
    );

    return {
      ...session,
      setGroups: setGroupsWithSets,
    };
  },
});
