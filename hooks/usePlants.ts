import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export function usePlants(userId: Id<'users'> | undefined) {
  const plants = useQuery(
    api.plants.list,
    userId ? { userId } : 'skip'
  );

  const createPlant = useMutation(api.plants.create);
  const recordEventMutation = useMutation(api.plants.recordEvent);
  const removePlant = useMutation(api.plants.remove);
  const updateNameMutation = useMutation(api.plants.updateName);

  const addPlant = async (speciesId: Id<'species'>, sowDate: string) => {
    if (!userId) throw new Error('Not authenticated');
    return createPlant({ userId, speciesId, sowDate });
  };

  const recordEvent = async (
    plantId: Id<'plants'>,
    type: 'germinated' | 'transplanted' | 'hardened' | 'planted-out' | 'harvested' | 'note',
    note?: string
  ) => {
    if (!userId) throw new Error('Not authenticated');
    return recordEventMutation({ plantId, userId, type, note });
  };

  const deletePlant = async (plantId: Id<'plants'>) => {
    if (!userId) throw new Error('Not authenticated');
    return removePlant({ plantId, userId });
  };

  const updateName = async (plantId: Id<'plants'>, name: string) => {
    if (!userId) throw new Error('Not authenticated');
    return updateNameMutation({ plantId, userId, name });
  };

  return {
    plants: plants ?? [],
    loading: plants === undefined,
    addPlant,
    recordEvent,
    deletePlant,
    updateName,
  };
}

// Hook to get a single plant with its species and events
export function usePlant(plantId: Id<'plants'> | undefined) {
  const plant = useQuery(
    api.plants.get,
    plantId ? { id: plantId } : 'skip'
  );

  return {
    plant,
    loading: plant === undefined,
  };
}
