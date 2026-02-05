import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Get user by ID
export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create or update user on login
export const upsert = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new user with UK defaults
      const currentYear = new Date().getFullYear();
      const id = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        // UK defaults
        location: "United Kingdom",
        lastFrostDate: new Date(currentYear, 4, 15).toISOString(), // May 15
        firstFrostDate: new Date(currentYear, 9, 15).toISOString(), // October 15
        useManualDates: false,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    }
  },
});

// Update user settings
export const updateSettings = mutation({
  args: {
    userId: v.id("users"),
    location: v.optional(v.string()),
    lastFrostDate: v.optional(v.string()),
    firstFrostDate: v.optional(v.string()),
    useManualDates: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Filter out undefined values
    const cleanUpdates: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    await ctx.db.patch(userId, cleanUpdates);
  },
});

// Get user's settings
export const getSettings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    return {
      location: user.location,
      lastFrostDate: user.lastFrostDate,
      firstFrostDate: user.firstFrostDate,
      useManualDates: user.useManualDates,
    };
  },
});
