import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all plants for current user
export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const plants = await ctx.db
      .query("plants")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return plants;
  },
});

// Get single plant with events
export const get = query({
  args: { id: v.id("plants") },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.id);
    if (!plant) return null;

    const events = await ctx.db
      .query("plantEvents")
      .withIndex("by_plant", (q) => q.eq("plantId", args.id))
      .collect();

    const species = await ctx.db.get(plant.speciesId);

    return { ...plant, events, species };
  },
});

// Add a new plant from species
export const create = mutation({
  args: {
    userId: v.id("users"),
    speciesId: v.id("species"),
    sowDate: v.string(),
  },
  handler: async (ctx, args) => {
    const species = await ctx.db.get(args.speciesId);
    if (!species) throw new Error("Species not found");

    const now = Date.now();
    const plantId = await ctx.db.insert("plants", {
      userId: args.userId,
      speciesId: args.speciesId,
      name: species.name,
      sowedIndoors: args.sowDate,
      // Copy from species
      daysToGermination: species.daysToGermination,
      daysToTransplant: species.daysToTransplant,
      daysToHardenOff: species.daysToHardenOff,
      daysToPlantOut: species.daysToPlantOut,
      daysToHarvest: species.daysToHarvest,
      category: species.category,
      createdAt: now,
      updatedAt: now,
    });

    // Log the sow event
    await ctx.db.insert("plantEvents", {
      plantId,
      userId: args.userId,
      type: "sowed",
      date: args.sowDate,
      note: `Sowed ${species.name} indoors`,
      createdAt: now,
    });

    return plantId;
  },
});

// Record a growth event
export const recordEvent = mutation({
  args: {
    plantId: v.id("plants"),
    userId: v.id("users"),
    type: v.union(
      v.literal("germinated"),
      v.literal("transplanted"),
      v.literal("hardened"),
      v.literal("planted-out"),
      v.literal("harvested"),
      v.literal("note")
    ),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    if (!plant) throw new Error("Plant not found");
    if (plant.userId !== args.userId) throw new Error("Not authorized");

    const now = Date.now();
    const dateStr = new Date().toISOString();

    // Update plant stage date
    const updates: Record<string, string | number> = { updatedAt: now };
    switch (args.type) {
      case "germinated":
        updates.germinatedDate = dateStr;
        break;
      case "transplanted":
        updates.transplantedDate = dateStr;
        break;
      case "hardened":
        updates.hardenedOffDate = dateStr;
        break;
      case "planted-out":
        updates.plantedOutDate = dateStr;
        break;
      case "harvested":
        if (!plant.firstHarvestDate) {
          updates.firstHarvestDate = dateStr;
        }
        break;
    }

    await ctx.db.patch(args.plantId, updates);

    // Log the event
    const eventId = await ctx.db.insert("plantEvents", {
      plantId: args.plantId,
      userId: args.userId,
      type: args.type,
      date: dateStr,
      note: args.note,
      createdAt: now,
    });

    return eventId;
  },
});

// Delete a plant and its events
export const remove = mutation({
  args: {
    plantId: v.id("plants"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    if (!plant) throw new Error("Plant not found");
    if (plant.userId !== args.userId) throw new Error("Not authorized");

    // Delete all events
    const events = await ctx.db
      .query("plantEvents")
      .withIndex("by_plant", (q) => q.eq("plantId", args.plantId))
      .collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    // Delete the plant
    await ctx.db.delete(args.plantId);
  },
});

// Update plant name
export const updateName = mutation({
  args: {
    plantId: v.id("plants"),
    userId: v.id("users"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const plant = await ctx.db.get(args.plantId);
    if (!plant) throw new Error("Plant not found");
    if (plant.userId !== args.userId) throw new Error("Not authorized");

    await ctx.db.patch(args.plantId, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});
