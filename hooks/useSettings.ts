import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// Default settings for non-authenticated users
const DEFAULT_SETTINGS = {
  location: 'United Kingdom',
  lastFrostDate: new Date(new Date().getFullYear(), 4, 15).toISOString(),
  firstFrostDate: new Date(new Date().getFullYear(), 9, 15).toISOString(),
  useManualDates: false,
};

export function useSettings(userId: Id<'users'> | undefined) {
  const settings = useQuery(
    api.users.getSettings,
    userId ? { userId } : 'skip'
  );

  const updateSettingsMutation = useMutation(api.users.updateSettings);

  const updateSettings = async (updates: {
    location?: string;
    lastFrostDate?: string;
    firstFrostDate?: string;
    useManualDates?: boolean;
  }) => {
    if (!userId) throw new Error('Not authenticated');
    return updateSettingsMutation({ userId, ...updates });
  };

  return {
    settings: settings ?? DEFAULT_SETTINGS,
    loading: settings === undefined,
    updateSettings,
  };
}
