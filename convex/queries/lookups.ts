import { query } from "../_generated/server";

// Get all equipment options
export const getEquipment = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("equipment").collect();
  },
});

// Get all muscle groups
export const getMuscleGroups = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("muscleGroups").collect();
  },
});

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Get all repetition units
export const getRepetitionUnits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("repetitionUnits").collect();
  },
});

// Get all weight units
export const getWeightUnits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("weightUnits").collect();
  },
});
