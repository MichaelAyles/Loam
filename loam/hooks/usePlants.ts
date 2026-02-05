import { useCallback, useEffect, useState } from 'react';
import { Plant, PlantEvent, PlantTemplate } from '../types';
import {
  addPlant as addPlantToStorage,
  deletePlant as deletePlantFromStorage,
  generateId,
  getPlants,
  updatePlant as updatePlantInStorage,
} from '../data/storage';

interface UsePlantsReturn {
  plants: Plant[];
  loading: boolean;
  error: string | null;
  addPlant: (template: PlantTemplate, sowDate: string) => Promise<Plant>;
  updatePlant: (plant: Plant) => Promise<void>;
  deletePlant: (plantId: string) => Promise<void>;
  recordEvent: (plantId: string, eventType: PlantEvent['type'], note?: string) => Promise<void>;
  refreshPlants: () => Promise<void>;
}

export function usePlants(): UsePlantsReturn {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load plants from storage
  const refreshPlants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storedPlants = await getPlants();
      setPlants(storedPlants);
    } catch (err) {
      setError('Failed to load plants');
      console.error('Error loading plants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshPlants();
  }, [refreshPlants]);

  // Add a new plant from template
  const addPlant = useCallback(async (template: PlantTemplate, sowDate: string): Promise<Plant> => {
    const now = new Date().toISOString();
    const newPlant: Plant = {
      id: generateId(),
      templateId: template.id,
      name: template.name,
      category: template.category,
      sowedIndoors: sowDate,
      daysToGermination: template.daysToGermination,
      daysToTransplant: template.daysToTransplant,
      daysToHardenOff: template.daysToHardenOff,
      daysToPlantOut: template.daysToPlantOut,
      daysToHarvest: template.daysToHarvest,
      events: [
        {
          id: generateId(),
          date: sowDate,
          type: 'sowed',
          note: `Sowed ${template.name} indoors`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    try {
      await addPlantToStorage(newPlant);
      setPlants(prev => [...prev, newPlant]);
      return newPlant;
    } catch (err) {
      setError('Failed to add plant');
      throw err;
    }
  }, []);

  // Update an existing plant
  const updatePlant = useCallback(async (plant: Plant): Promise<void> => {
    try {
      await updatePlantInStorage(plant);
      setPlants(prev =>
        prev.map(p => (p.id === plant.id ? { ...plant, updatedAt: new Date().toISOString() } : p))
      );
    } catch (err) {
      setError('Failed to update plant');
      throw err;
    }
  }, []);

  // Delete a plant
  const deletePlant = useCallback(async (plantId: string): Promise<void> => {
    try {
      await deletePlantFromStorage(plantId);
      setPlants(prev => prev.filter(p => p.id !== plantId));
    } catch (err) {
      setError('Failed to delete plant');
      throw err;
    }
  }, []);

  // Record a growth event for a plant
  const recordEvent = useCallback(
    async (plantId: string, eventType: PlantEvent['type'], note?: string): Promise<void> => {
      const plant = plants.find(p => p.id === plantId);
      if (!plant) {
        throw new Error('Plant not found');
      }

      const now = new Date().toISOString();
      const event: PlantEvent = {
        id: generateId(),
        date: now,
        type: eventType,
        note,
      };

      // Update the plant with the new event and stage date
      const updatedPlant: Plant = {
        ...plant,
        events: [...plant.events, event],
        updatedAt: now,
      };

      // Update the appropriate stage date
      switch (eventType) {
        case 'germinated':
          updatedPlant.germinatedDate = now;
          break;
        case 'transplanted':
          updatedPlant.transplantedDate = now;
          break;
        case 'hardened':
          updatedPlant.hardenedOffDate = now;
          break;
        case 'planted-out':
          updatedPlant.plantedOutDate = now;
          break;
        case 'harvested':
          if (!updatedPlant.firstHarvestDate) {
            updatedPlant.firstHarvestDate = now;
          }
          break;
      }

      await updatePlant(updatedPlant);
    },
    [plants, updatePlant]
  );

  return {
    plants,
    loading,
    error,
    addPlant,
    updatePlant,
    deletePlant,
    recordEvent,
    refreshPlants,
  };
}
