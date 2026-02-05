import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, Settings, STORAGE_KEYS } from '../types';

// Default settings for UK
export const DEFAULT_SETTINGS: Settings = {
  location: 'United Kingdom',
  lastFrostDate: new Date(new Date().getFullYear(), 4, 15).toISOString(), // May 15
  firstFrostDate: new Date(new Date().getFullYear(), 9, 15).toISOString(), // October 15
  useManualDates: false,
};

// Plant storage operations
export async function getPlants(): Promise<Plant[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PLANTS);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading plants from storage:', error);
    return [];
  }
}

export async function savePlants(plants: Plant[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
  } catch (error) {
    console.error('Error saving plants to storage:', error);
    throw error;
  }
}

export async function addPlant(plant: Plant): Promise<void> {
  const plants = await getPlants();
  plants.push(plant);
  await savePlants(plants);
}

export async function updatePlant(updatedPlant: Plant): Promise<void> {
  const plants = await getPlants();
  const index = plants.findIndex(p => p.id === updatedPlant.id);
  if (index !== -1) {
    plants[index] = { ...updatedPlant, updatedAt: new Date().toISOString() };
    await savePlants(plants);
  }
}

export async function deletePlant(plantId: string): Promise<void> {
  const plants = await getPlants();
  const filtered = plants.filter(p => p.id !== plantId);
  await savePlants(filtered);
}

export async function getPlantById(plantId: string): Promise<Plant | null> {
  const plants = await getPlants();
  return plants.find(p => p.id === plantId) || null;
}

// Settings storage operations
export async function getSettings(): Promise<Settings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error reading settings from storage:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to storage:', error);
    throw error;
  }
}

// Utility to clear all app data (for development/reset)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.PLANTS, STORAGE_KEYS.SETTINGS]);
  } catch (error) {
    console.error('Error clearing app data:', error);
    throw error;
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
