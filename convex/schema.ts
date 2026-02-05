import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Shared species library - managed centrally, available to all users
  species: defineTable({
    name: v.string(),
    category: v.union(v.literal("veg"), v.literal("herb"), v.literal("fruit")),
    daysToGermination: v.number(),
    daysToTransplant: v.number(),
    daysToHardenOff: v.number(),
    daysToPlantOut: v.number(), // Relative to last frost
    daysToHarvest: v.number(),
    sowIndoorsWeeksBefore: v.optional(v.number()),
    directSowWeeksAfter: v.optional(v.number()),
    notes: v.optional(v.string()),
    // Metadata
    isApproved: v.boolean(), // Only approved species show in library
    createdBy: v.optional(v.id("users")), // null = system/admin added
    createdAt: v.number(),
  })
    .index("by_category", ["category", "isApproved"])
    .index("by_approved", ["isApproved"])
    .searchIndex("search_name", { searchField: "name" }),

  // User profiles
  users: defineTable({
    // Clerk/Auth user ID
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    // Settings
    location: v.string(),
    lastFrostDate: v.string(), // ISO date
    firstFrostDate: v.string(), // ISO date
    useManualDates: v.boolean(),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // User's plants (instances of species)
  plants: defineTable({
    userId: v.id("users"),
    speciesId: v.id("species"),
    name: v.string(), // Can override species name
    // Growth stage dates (ISO strings)
    sowedIndoors: v.optional(v.string()),
    germinatedDate: v.optional(v.string()),
    transplantedDate: v.optional(v.string()),
    hardenedOffDate: v.optional(v.string()),
    plantedOutDate: v.optional(v.string()),
    firstHarvestDate: v.optional(v.string()),
    // Cached from species for offline/performance
    daysToGermination: v.number(),
    daysToTransplant: v.number(),
    daysToHardenOff: v.number(),
    daysToPlantOut: v.number(),
    daysToHarvest: v.number(),
    category: v.union(v.literal("veg"), v.literal("herb"), v.literal("fruit")),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_species", ["userId", "speciesId"]),

  // Plant events log
  plantEvents: defineTable({
    plantId: v.id("plants"),
    userId: v.id("users"),
    type: v.union(
      v.literal("sowed"),
      v.literal("germinated"),
      v.literal("transplanted"),
      v.literal("hardened"),
      v.literal("planted-out"),
      v.literal("harvested"),
      v.literal("note")
    ),
    date: v.string(), // ISO date
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_plant", ["plantId"])
    .index("by_user", ["userId"]),

  // Garden sharing
  gardenShares: defineTable({
    ownerId: v.id("users"),
    sharedWithEmail: v.string(),
    sharedWithUserId: v.optional(v.id("users")), // Populated when user joins
    permission: v.union(v.literal("view"), v.literal("edit")),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("declined")),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_shared_email", ["sharedWithEmail"])
    .index("by_shared_user", ["sharedWithUserId"]),
});
