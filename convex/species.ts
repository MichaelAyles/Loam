import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

// Get all approved species
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("species")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .collect();
  },
});

// Get species by category
export const listByCategory = query({
  args: { category: v.union(v.literal("veg"), v.literal("herb"), v.literal("fruit")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("species")
      .withIndex("by_category", (q) =>
        q.eq("category", args.category).eq("isApproved", true)
      )
      .collect();
  },
});

// Get single species by ID
export const get = query({
  args: { id: v.id("species") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Search species by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (args.query.length < 2) {
      return [];
    }
    const results = await ctx.db
      .query("species")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .take(20);
    return results;
  },
});

// Seed the initial species database (internal, called once)
export const seedSpecies = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingSpecies = await ctx.db.query("species").first();
    if (existingSpecies) {
      return { message: "Species already seeded" };
    }

    const now = Date.now();
    const species = [
      // Tomatoes
      {
        name: "Tomato - Moneymaker",
        category: "veg" as const,
        daysToGermination: 7,
        daysToTransplant: 21,
        daysToHardenOff: 7,
        daysToPlantOut: 0,
        daysToHarvest: 80,
        sowIndoorsWeeksBefore: 8,
        notes: "Classic UK variety, reliable cropper. Cordon/indeterminate type.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Tomato - Gardener's Delight",
        category: "veg" as const,
        daysToGermination: 7,
        daysToTransplant: 21,
        daysToHardenOff: 7,
        daysToPlantOut: 0,
        daysToHarvest: 75,
        sowIndoorsWeeksBefore: 8,
        notes: "Sweet cherry tomato, heavy cropper. Cordon type.",
        isApproved: true,
        createdAt: now,
      },
      // Courgette
      {
        name: "Courgette - Black Beauty",
        category: "veg" as const,
        daysToGermination: 7,
        daysToTransplant: 14,
        daysToHardenOff: 7,
        daysToPlantOut: 14,
        daysToHarvest: 50,
        sowIndoorsWeeksBefore: 4,
        notes: "Dark green fruits, prolific producer. Pick when 10-15cm for best flavour.",
        isApproved: true,
        createdAt: now,
      },
      // Runner Beans
      {
        name: "Runner Beans - Scarlet Emperor",
        category: "veg" as const,
        daysToGermination: 10,
        daysToTransplant: 14,
        daysToHardenOff: 7,
        daysToPlantOut: 14,
        daysToHarvest: 60,
        sowIndoorsWeeksBefore: 4,
        directSowWeeksAfter: 2,
        notes: "Classic variety with red flowers. Needs support structure.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Runner Beans - Painted Lady",
        category: "veg" as const,
        daysToGermination: 10,
        daysToTransplant: 14,
        daysToHardenOff: 7,
        daysToPlantOut: 14,
        daysToHarvest: 65,
        sowIndoorsWeeksBefore: 4,
        directSowWeeksAfter: 2,
        notes: "Bi-coloured red and white flowers. Heritage variety.",
        isApproved: true,
        createdAt: now,
      },
      // Chilli Peppers
      {
        name: "Chilli - Jalapeño",
        category: "veg" as const,
        daysToGermination: 14,
        daysToTransplant: 28,
        daysToHardenOff: 10,
        daysToPlantOut: 14,
        daysToHarvest: 75,
        sowIndoorsWeeksBefore: 10,
        notes: "Medium heat (2,500-8,000 SHU). Great for UK growing under cover.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Chilli - Cayenne",
        category: "veg" as const,
        daysToGermination: 14,
        daysToTransplant: 28,
        daysToHardenOff: 10,
        daysToPlantOut: 14,
        daysToHarvest: 80,
        sowIndoorsWeeksBefore: 10,
        notes: "Hot variety (30,000-50,000 SHU). Good for drying.",
        isApproved: true,
        createdAt: now,
      },
      // Lettuce
      {
        name: "Lettuce - Little Gem",
        category: "veg" as const,
        daysToGermination: 7,
        daysToTransplant: 14,
        daysToHardenOff: 5,
        daysToPlantOut: -14,
        daysToHarvest: 45,
        sowIndoorsWeeksBefore: 6,
        directSowWeeksAfter: 0,
        notes: "Compact cos type, sweet and crunchy. Bolt resistant.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Lettuce - Butterhead",
        category: "veg" as const,
        daysToGermination: 7,
        daysToTransplant: 14,
        daysToHardenOff: 5,
        daysToPlantOut: -14,
        daysToHarvest: 50,
        sowIndoorsWeeksBefore: 6,
        directSowWeeksAfter: 0,
        notes: "Soft, buttery leaves. Harvest whole head or pick outer leaves.",
        isApproved: true,
        createdAt: now,
      },
      // Herbs
      {
        name: "Basil - Genovese",
        category: "herb" as const,
        daysToGermination: 7,
        daysToTransplant: 21,
        daysToHardenOff: 7,
        daysToPlantOut: 14,
        daysToHarvest: 30,
        sowIndoorsWeeksBefore: 6,
        notes: "Classic Italian basil. Keep warm, pinch out flowers.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Basil - Thai",
        category: "herb" as const,
        daysToGermination: 7,
        daysToTransplant: 21,
        daysToHardenOff: 7,
        daysToPlantOut: 14,
        daysToHarvest: 30,
        sowIndoorsWeeksBefore: 6,
        notes: "Anise/liquorice flavour. Purple stems, pink flowers.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Coriander - Slow Bolt",
        category: "herb" as const,
        daysToGermination: 10,
        daysToTransplant: 14,
        daysToHardenOff: 5,
        daysToPlantOut: 0,
        daysToHarvest: 21,
        sowIndoorsWeeksBefore: 4,
        directSowWeeksAfter: 0,
        notes: "Slower to bolt than standard varieties. Sow successionally.",
        isApproved: true,
        createdAt: now,
      },
      {
        name: "Parsley - Flat Leaf",
        category: "herb" as const,
        daysToGermination: 21,
        daysToTransplant: 28,
        daysToHardenOff: 7,
        daysToPlantOut: -7,
        daysToHarvest: 30,
        sowIndoorsWeeksBefore: 10,
        notes: "Italian flat-leaf type. Stronger flavour than curly.",
        isApproved: true,
        createdAt: now,
      },
      // Fruits
      {
        name: "Strawberry - Cambridge Favourite",
        category: "fruit" as const,
        daysToGermination: 21,
        daysToTransplant: 42,
        daysToHardenOff: 7,
        daysToPlantOut: -7,
        daysToHarvest: 120,
        sowIndoorsWeeksBefore: 12,
        notes: "Classic UK variety. Usually grown from runners, not seed.",
        isApproved: true,
        createdAt: now,
      },
    ];

    for (const s of species) {
      await ctx.db.insert("species", s);
    }

    return { message: `Seeded ${species.length} species` };
  },
});

// Admin: Add a new species (requires admin check in real app)
export const create = mutation({
  args: {
    name: v.string(),
    category: v.union(v.literal("veg"), v.literal("herb"), v.literal("fruit")),
    daysToGermination: v.number(),
    daysToTransplant: v.number(),
    daysToHardenOff: v.number(),
    daysToPlantOut: v.number(),
    daysToHarvest: v.number(),
    sowIndoorsWeeksBefore: v.optional(v.number()),
    directSowWeeksAfter: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("species", {
      ...args,
      isApproved: false, // Requires admin approval
      createdAt: Date.now(),
    });
    return id;
  },
});
