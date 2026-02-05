import { addDays, parseISO } from 'date-fns';
import { Plant, Task, TaskType } from '../types';
import { getDaysFromToday, getToday, isWithinDays } from './dates';

// Task derivation window - how many days before/after a task is due to show it
const TASK_WINDOW_DAYS = 7;

// Generate a unique task ID
function generateTaskId(type: TaskType, plantId: string): string {
  return `${type}-${plantId}`;
}

// Get task description based on type
function getTaskDescription(type: TaskType, plantName: string): string {
  switch (type) {
    case 'check-germination':
      return `Check if ${plantName} has germinated`;
    case 'transplant':
      return `Transplant ${plantName} to larger pots`;
    case 'start-hardening':
      return `Start hardening off ${plantName}`;
    case 'plant-out':
      return `Plant out ${plantName} in final position`;
    case 'check-harvest':
      return `Check ${plantName} for harvest`;
    default:
      return `Task for ${plantName}`;
  }
}

// Derive tasks for a single plant
export function deriveTasksForPlant(plant: Plant, lastFrostDate: string): Task[] {
  const tasks: Task[] = [];
  const today = getToday();

  // 1. Check germination - if sowed but not germinated
  if (plant.sowedIndoors && !plant.germinatedDate) {
    const sowDate = parseISO(plant.sowedIndoors);
    const expectedGermination = addDays(sowDate, plant.daysToGermination);
    const daysDiff = getDaysFromToday(expectedGermination);

    // Show task within window
    if (daysDiff >= -TASK_WINDOW_DAYS && daysDiff <= TASK_WINDOW_DAYS) {
      tasks.push({
        id: generateTaskId('check-germination', plant.id),
        type: 'check-germination',
        plantId: plant.id,
        plantName: plant.name,
        dueDate: expectedGermination.toISOString(),
        description: getTaskDescription('check-germination', plant.name),
        isOverdue: daysDiff < 0,
        daysDiff,
      });
    }
  }

  // 2. Transplant - if germinated but not transplanted
  if (plant.germinatedDate && !plant.transplantedDate) {
    const germinationDate = parseISO(plant.germinatedDate);
    const expectedTransplant = addDays(germinationDate, plant.daysToTransplant);
    const daysDiff = getDaysFromToday(expectedTransplant);

    if (daysDiff >= -TASK_WINDOW_DAYS && daysDiff <= TASK_WINDOW_DAYS) {
      tasks.push({
        id: generateTaskId('transplant', plant.id),
        type: 'transplant',
        plantId: plant.id,
        plantName: plant.name,
        dueDate: expectedTransplant.toISOString(),
        description: getTaskDescription('transplant', plant.name),
        isOverdue: daysDiff < 0,
        daysDiff,
      });
    }
  }

  // 3. Hardening off - if transplanted but not hardened off
  if (plant.transplantedDate && !plant.hardenedOffDate) {
    // Calculate plant out date first
    const frostDate = parseISO(lastFrostDate);
    const plantOutDate = addDays(frostDate, plant.daysToPlantOut);
    const hardenOffStart = addDays(plantOutDate, -plant.daysToHardenOff);
    const daysDiff = getDaysFromToday(hardenOffStart);

    if (daysDiff >= -TASK_WINDOW_DAYS && daysDiff <= TASK_WINDOW_DAYS) {
      tasks.push({
        id: generateTaskId('start-hardening', plant.id),
        type: 'start-hardening',
        plantId: plant.id,
        plantName: plant.name,
        dueDate: hardenOffStart.toISOString(),
        description: getTaskDescription('start-hardening', plant.name),
        isOverdue: daysDiff < 0,
        daysDiff,
      });
    }
  }

  // 4. Plant out - if hardened off but not planted out
  if (plant.hardenedOffDate && !plant.plantedOutDate) {
    const frostDate = parseISO(lastFrostDate);
    const plantOutDate = addDays(frostDate, plant.daysToPlantOut);
    const daysDiff = getDaysFromToday(plantOutDate);

    if (daysDiff >= -TASK_WINDOW_DAYS && daysDiff <= TASK_WINDOW_DAYS) {
      tasks.push({
        id: generateTaskId('plant-out', plant.id),
        type: 'plant-out',
        plantId: plant.id,
        plantName: plant.name,
        dueDate: plantOutDate.toISOString(),
        description: getTaskDescription('plant-out', plant.name),
        isOverdue: daysDiff < 0,
        daysDiff,
      });
    }
  }

  // 5. Check harvest - if planted out but not harvested
  if (plant.plantedOutDate && !plant.firstHarvestDate) {
    const plantOutDate = parseISO(plant.plantedOutDate);
    const expectedHarvest = addDays(plantOutDate, plant.daysToHarvest);
    const daysDiff = getDaysFromToday(expectedHarvest);

    // Show harvest task closer to the date
    if (daysDiff >= -14 && daysDiff <= 14) {
      tasks.push({
        id: generateTaskId('check-harvest', plant.id),
        type: 'check-harvest',
        plantId: plant.id,
        plantName: plant.name,
        dueDate: expectedHarvest.toISOString(),
        description: getTaskDescription('check-harvest', plant.name),
        isOverdue: daysDiff < 0,
        daysDiff,
      });
    }
  }

  return tasks;
}

// Derive all tasks from all plants
export function deriveTasks(plants: Plant[], lastFrostDate: string): Task[] {
  const allTasks: Task[] = [];

  for (const plant of plants) {
    const plantTasks = deriveTasksForPlant(plant, lastFrostDate);
    allTasks.push(...plantTasks);
  }

  // Sort by due date (overdue first, then by date)
  return allTasks.sort((a, b) => {
    // Overdue tasks first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    // Then by days difference (closest to today first)
    return a.daysDiff - b.daysDiff;
  });
}

// Get the current growth stage for a plant
export type GrowthStage =
  | 'not-started'
  | 'sowed'
  | 'germinated'
  | 'transplanted'
  | 'hardening'
  | 'planted-out'
  | 'growing'
  | 'harvesting';

export function getCurrentStage(plant: Plant): GrowthStage {
  if (plant.firstHarvestDate) return 'harvesting';
  if (plant.plantedOutDate) return 'growing';
  if (plant.hardenedOffDate) return 'planted-out';
  if (plant.transplantedDate) return 'hardening';
  if (plant.germinatedDate) return 'transplanted';
  if (plant.sowedIndoors) return 'germinated';
  return 'not-started';
}

// Get stage display info
export function getStageDisplayInfo(stage: GrowthStage): { label: string; emoji: string } {
  switch (stage) {
    case 'not-started':
      return { label: 'Not started', emoji: '📦' };
    case 'sowed':
      return { label: 'Sowed', emoji: '🌱' };
    case 'germinated':
      return { label: 'Germinated', emoji: '🌿' };
    case 'transplanted':
      return { label: 'Transplanted', emoji: '🪴' };
    case 'hardening':
      return { label: 'Hardening off', emoji: '💪' };
    case 'planted-out':
      return { label: 'Planted out', emoji: '🏡' };
    case 'growing':
      return { label: 'Growing', emoji: '🌳' };
    case 'harvesting':
      return { label: 'Harvesting', emoji: '🥬' };
    default:
      return { label: 'Unknown', emoji: '❓' };
  }
}
