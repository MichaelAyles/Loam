// Plant-related types
export type PlantCategory = 'veg' | 'herb' | 'fruit';

export interface PlantTemplate {
  id: string;
  name: string;
  category: PlantCategory;
  daysToGermination: number;
  daysToTransplant: number;     // Days after germination before ready to transplant
  daysToHardenOff: number;      // Days to harden off before planting out
  daysToPlantOut: number;       // Days relative to last frost (0 = on frost date, negative = before)
  daysToHarvest: number;        // Days from transplant to first harvest
  sowIndoorsWeeksBefore?: number; // Weeks before last frost to start indoors
  directSowWeeksAfter?: number;   // Weeks after last frost for direct sowing
  notes?: string;
}

export interface PlantEvent {
  id: string;
  date: string;  // ISO date string
  type: 'sowed' | 'germinated' | 'transplanted' | 'hardened' | 'planted-out' | 'harvested' | 'note';
  note?: string;
}

export interface Plant {
  id: string;
  templateId: string;
  name: string;
  category: PlantCategory;

  // Dates (ISO strings)
  sowedIndoors?: string;
  germinatedDate?: string;
  transplantedDate?: string;
  hardenedOffDate?: string;
  plantedOutDate?: string;
  firstHarvestDate?: string;

  // Template data copied for offline use
  daysToGermination: number;
  daysToTransplant: number;
  daysToHardenOff: number;
  daysToPlantOut: number;
  daysToHarvest: number;

  // Event log
  events: PlantEvent[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Task types
export type TaskType =
  | 'check-germination'
  | 'transplant'
  | 'start-hardening'
  | 'plant-out'
  | 'check-harvest';

export interface Task {
  id: string;
  type: TaskType;
  plantId: string;
  plantName: string;
  dueDate: string;          // ISO date string
  description: string;
  isOverdue: boolean;
  daysDiff: number;         // Negative = overdue, positive = future
}

// Settings types
export interface Settings {
  location: string;
  lastFrostDate: string;    // ISO date string (month-day format stored as full date)
  firstFrostDate: string;   // ISO date string
  useManualDates: boolean;
}

// Wizard state
export interface AddPlantWizardState {
  category?: PlantCategory;
  template?: PlantTemplate;
  sowDate?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  PLANTS: '@loam/plants',
  SETTINGS: '@loam/settings',
} as const;
