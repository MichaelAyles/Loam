import {
  addDays,
  addWeeks,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  isToday,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';

// Format date for display
export function formatDate(date: Date | string, formatStr: string = 'MMM d'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatDateLong(date: Date | string): string {
  return formatDate(date, 'EEEE, MMMM d');
}

export function formatDateFull(date: Date | string): string {
  return formatDate(date, 'MMMM d, yyyy');
}

// Parse ISO string to Date
export function parseDate(isoString: string): Date {
  return parseISO(isoString);
}

// Get today's date at start of day
export function getToday(): Date {
  return startOfDay(new Date());
}

// Check if a date is within N days of today
export function isWithinDays(date: Date | string, days: number): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = getToday();
  const futureDate = addDays(today, days);
  const pastDate = addDays(today, -days);

  return isWithinInterval(d, { start: pastDate, end: futureDate });
}

// Get days difference from today (negative = past, positive = future)
export function getDaysFromToday(date: Date | string): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(startOfDay(d), getToday());
}

// Check if date is in the past
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(startOfDay(d), getToday());
}

// Check if date is in the future
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(startOfDay(d), getToday());
}

// Check if date is today
export function isDateToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isToday(d);
}

// Calculate sow date based on last frost date and weeks before
export function calculateSowDate(lastFrostDate: string, weeksBefore: number): Date {
  const frostDate = parseISO(lastFrostDate);
  return addWeeks(frostDate, -weeksBefore);
}

// Calculate expected germination date
export function calculateGerminationDate(sowDate: string, daysToGermination: number): Date {
  return addDays(parseISO(sowDate), daysToGermination);
}

// Calculate transplant date
export function calculateTransplantDate(germinationDate: string, daysToTransplant: number): Date {
  return addDays(parseISO(germinationDate), daysToTransplant);
}

// Calculate hardening off start date
export function calculateHardenOffDate(plantOutDate: Date, daysToHardenOff: number): Date {
  return addDays(plantOutDate, -daysToHardenOff);
}

// Calculate plant out date based on last frost date
export function calculatePlantOutDate(lastFrostDate: string, daysRelativeToFrost: number): Date {
  return addDays(parseISO(lastFrostDate), daysRelativeToFrost);
}

// Calculate expected harvest date
export function calculateHarvestDate(plantOutDate: Date, daysToHarvest: number): Date {
  return addDays(plantOutDate, daysToHarvest);
}

// Get a friendly relative date string
export function getRelativeDateString(date: Date | string): string {
  const days = getDaysFromToday(date);

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0 && days <= 7) return `In ${days} days`;
  if (days < 0 && days >= -7) return `${Math.abs(days)} days ago`;

  return formatDate(date, 'MMM d');
}

// Get date status for task highlighting
export type DateStatus = 'overdue' | 'today' | 'upcoming' | 'future';

export function getDateStatus(date: Date | string, windowDays: number = 3): DateStatus {
  const days = getDaysFromToday(date);

  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= windowDays) return 'upcoming';
  return 'future';
}
