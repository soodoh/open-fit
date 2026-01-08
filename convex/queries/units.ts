import { query } from "../_generated/server";

// Get all repetition and weight units
export const list = query({
  args: {},
  handler: async (ctx) => {
    const repetitionUnits = await ctx.db.query("repetitionUnits").collect();
    const weightUnits = await ctx.db.query("weightUnits").collect();

    return {
      repetitionUnits,
      weightUnits,
    };
  },
});

// Get repetition units only
export const listRepetitionUnits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("repetitionUnits").collect();
  },
});

// Get weight units only
export const listWeightUnits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("weightUnits").collect();
  },
});
