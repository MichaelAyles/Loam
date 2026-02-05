import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useEffect } from 'react';
import { Id } from '../convex/_generated/dataModel';

export function useAuth() {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Sync user to Convex on login
  const upsertUser = useMutation(api.users.upsert);

  // Get user from Convex
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser?.id ? { clerkId: clerkUser.id } : 'skip'
  );

  // Sync user when Clerk user changes
  useEffect(() => {
    if (isSignedIn && clerkUser?.id && clerkUser?.primaryEmailAddress?.emailAddress) {
      upsertUser({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress.emailAddress,
        name: clerkUser.fullName || undefined,
        imageUrl: clerkUser.imageUrl || undefined,
      });
    }
  }, [isSignedIn, clerkUser?.id, clerkUser?.primaryEmailAddress?.emailAddress]);

  return {
    isLoaded,
    isSignedIn,
    user: convexUser,
    userId: convexUser?._id as Id<'users'> | undefined,
    clerkUser,
    signOut,
  };
}
