import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get shares owned by user (people they've shared with)
export const getMyShares = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gardenShares")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.userId))
      .collect();
  },
});

// Get shares with user (gardens shared with them)
export const getSharedWithMe = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("gardenShares")
      .withIndex("by_shared_user", (q) => q.eq("sharedWithUserId", args.userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Get owner info for each share
    const sharesWithOwners = await Promise.all(
      shares.map(async (share) => {
        const owner = await ctx.db.get(share.ownerId);
        return { ...share, owner };
      })
    );

    return sharesWithOwners;
  },
});

// Get pending invitations for user (by email)
export const getPendingInvites = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("gardenShares")
      .withIndex("by_shared_email", (q) => q.eq("sharedWithEmail", args.email))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Get owner info for each share
    const sharesWithOwners = await Promise.all(
      shares.map(async (share) => {
        const owner = await ctx.db.get(share.ownerId);
        return { ...share, owner };
      })
    );

    return sharesWithOwners;
  },
});

// Share garden with someone
export const create = mutation({
  args: {
    ownerId: v.id("users"),
    email: v.string(),
    permission: v.union(v.literal("view"), v.literal("edit")),
  },
  handler: async (ctx, args) => {
    // Check if already shared
    const existing = await ctx.db
      .query("gardenShares")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .filter((q) => q.eq(q.field("sharedWithEmail"), args.email))
      .first();

    if (existing) {
      throw new Error("Already shared with this email");
    }

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    const id = await ctx.db.insert("gardenShares", {
      ownerId: args.ownerId,
      sharedWithEmail: args.email,
      sharedWithUserId: existingUser?._id,
      permission: args.permission,
      status: existingUser ? "accepted" : "pending", // Auto-accept if user exists
      createdAt: Date.now(),
    });

    return id;
  },
});

// Accept a share invitation
export const accept = mutation({
  args: {
    shareId: v.id("gardenShares"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Verify email matches
    if (share.sharedWithEmail !== user.email) {
      throw new Error("Email does not match");
    }

    await ctx.db.patch(args.shareId, {
      status: "accepted",
      sharedWithUserId: args.userId,
    });
  },
});

// Decline a share invitation
export const decline = mutation({
  args: {
    shareId: v.id("gardenShares"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    if (share.sharedWithEmail !== user.email) {
      throw new Error("Email does not match");
    }

    await ctx.db.patch(args.shareId, {
      status: "declined",
      sharedWithUserId: args.userId,
    });
  },
});

// Remove a share
export const remove = mutation({
  args: {
    shareId: v.id("gardenShares"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    // Only owner can remove
    if (share.ownerId !== args.userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.shareId);
  },
});

// Update share permission
export const updatePermission = mutation({
  args: {
    shareId: v.id("gardenShares"),
    userId: v.id("users"),
    permission: v.union(v.literal("view"), v.literal("edit")),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    if (share.ownerId !== args.userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.shareId, {
      permission: args.permission,
    });
  },
});

// Get plants from a shared garden
export const getSharedPlants = query({
  args: {
    shareId: v.id("gardenShares"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.get(args.shareId);
    if (!share) throw new Error("Share not found");

    // Verify access
    if (share.sharedWithUserId !== args.userId) {
      throw new Error("Not authorized");
    }

    if (share.status !== "accepted") {
      throw new Error("Share not accepted");
    }

    // Get owner's plants
    const plants = await ctx.db
      .query("plants")
      .withIndex("by_user", (q) => q.eq("userId", share.ownerId))
      .collect();

    return { plants, permission: share.permission };
  },
});
