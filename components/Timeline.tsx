import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { addDays, parseISO } from 'date-fns';
import { Plant } from '../types';
import { colors, borderRadius, spacing, typography } from '../theme';
import { formatDate, getDaysFromToday, getDateStatus } from '../utils/dates';

interface TimelineStage {
  label: string;
  date: Date | null;
  completed: boolean;
  isCurrent: boolean;
  emoji: string;
}

interface TimelineProps {
  plant: Plant;
  lastFrostDate: string;
}

export function Timeline({ plant, lastFrostDate }: TimelineProps) {
  const stages = getTimelineStages(plant, lastFrostDate);

  return (
    <View style={styles.container}>
      {stages.map((stage, index) => (
        <View key={stage.label} style={styles.stageRow}>
          {/* Timeline line */}
          <View style={styles.lineContainer}>
            {index > 0 && (
              <View
                style={[
                  styles.lineTop,
                  stage.completed && styles.lineCompleted,
                ]}
              />
            )}
            <View
              style={[
                styles.dot,
                stage.completed && styles.dotCompleted,
                stage.isCurrent && styles.dotCurrent,
              ]}
            >
              {stage.completed && <Text style={styles.checkmark}>✓</Text>}
              {stage.isCurrent && !stage.completed && (
                <View style={styles.currentDotInner} />
              )}
            </View>
            {index < stages.length - 1 && (
              <View
                style={[
                  styles.lineBottom,
                  stages[index + 1]?.completed && styles.lineCompleted,
                ]}
              />
            )}
          </View>

          {/* Stage content */}
          <View
            style={[
              styles.stageContent,
              stage.isCurrent && styles.stageContentCurrent,
            ]}
          >
            <View style={styles.stageHeader}>
              <Text style={styles.emoji}>{stage.emoji}</Text>
              <Text
                style={[
                  styles.stageLabel,
                  stage.completed && styles.stageLabelCompleted,
                  stage.isCurrent && styles.stageLabelCurrent,
                ]}
              >
                {stage.label}
              </Text>
            </View>
            {stage.date && (
              <Text
                style={[
                  styles.stageDate,
                  stage.completed && styles.stageDateCompleted,
                ]}
              >
                {formatDate(stage.date, 'MMM d, yyyy')}
                {!stage.completed && stage.isCurrent && (
                  <Text style={styles.expectedLabel}> (expected)</Text>
                )}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function getTimelineStages(plant: Plant, lastFrostDate: string): TimelineStage[] {
  const frostDate = parseISO(lastFrostDate);
  const plantOutDate = addDays(frostDate, plant.daysToPlantOut);

  // Calculate expected dates based on sow date if available
  let expectedGermination: Date | null = null;
  let expectedTransplant: Date | null = null;
  let expectedHardenOff: Date | null = null;
  let expectedHarvest: Date | null = null;

  if (plant.sowedIndoors) {
    const sowDate = parseISO(plant.sowedIndoors);
    expectedGermination = addDays(sowDate, plant.daysToGermination);

    if (plant.germinatedDate) {
      expectedTransplant = addDays(
        parseISO(plant.germinatedDate),
        plant.daysToTransplant
      );
    } else {
      expectedTransplant = addDays(expectedGermination, plant.daysToTransplant);
    }

    expectedHardenOff = addDays(plantOutDate, -plant.daysToHardenOff);

    if (plant.plantedOutDate) {
      expectedHarvest = addDays(
        parseISO(plant.plantedOutDate),
        plant.daysToHarvest
      );
    } else {
      expectedHarvest = addDays(plantOutDate, plant.daysToHarvest);
    }
  }

  // Determine current stage
  const hasGerminated = !!plant.germinatedDate;
  const hasTransplanted = !!plant.transplantedDate;
  const hasHardenedOff = !!plant.hardenedOffDate;
  const hasPlantedOut = !!plant.plantedOutDate;
  const hasHarvested = !!plant.firstHarvestDate;

  const stages: TimelineStage[] = [
    {
      label: 'Sowed Indoors',
      date: plant.sowedIndoors ? parseISO(plant.sowedIndoors) : null,
      completed: !!plant.sowedIndoors,
      isCurrent: !!plant.sowedIndoors && !hasGerminated,
      emoji: '🌱',
    },
    {
      label: 'Germinated',
      date: plant.germinatedDate
        ? parseISO(plant.germinatedDate)
        : expectedGermination,
      completed: hasGerminated,
      isCurrent: hasGerminated && !hasTransplanted,
      emoji: '🌿',
    },
    {
      label: 'Transplanted',
      date: plant.transplantedDate
        ? parseISO(plant.transplantedDate)
        : expectedTransplant,
      completed: hasTransplanted,
      isCurrent: hasTransplanted && !hasHardenedOff,
      emoji: '🪴',
    },
    {
      label: 'Hardening Off',
      date: plant.hardenedOffDate
        ? parseISO(plant.hardenedOffDate)
        : expectedHardenOff,
      completed: hasHardenedOff,
      isCurrent: hasHardenedOff && !hasPlantedOut,
      emoji: '💪',
    },
    {
      label: 'Planted Out',
      date: plant.plantedOutDate ? parseISO(plant.plantedOutDate) : plantOutDate,
      completed: hasPlantedOut,
      isCurrent: hasPlantedOut && !hasHarvested,
      emoji: '🏡',
    },
    {
      label: 'First Harvest',
      date: plant.firstHarvestDate
        ? parseISO(plant.firstHarvestDate)
        : expectedHarvest,
      completed: hasHarvested,
      isCurrent: hasHarvested,
      emoji: '🥬',
    },
  ];

  return stages;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  stageRow: {
    flexDirection: 'row',
    minHeight: 72,
  },
  lineContainer: {
    width: 40,
    alignItems: 'center',
  },
  lineTop: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  lineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  lineCompleted: {
    backgroundColor: colors.primary,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotCurrent: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  currentDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  },
  stageContent: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.lg,
  },
  stageContentCurrent: {
    backgroundColor: colors.primaryLight,
    marginLeft: spacing.sm,
    marginRight: -spacing.lg,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  stageLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  stageLabelCompleted: {
    color: colors.text,
  },
  stageLabelCurrent: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  stageDate: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
    marginLeft: 26,
  },
  stageDateCompleted: {
    color: colors.textMuted,
  },
  expectedLabel: {
    fontStyle: 'italic',
  },
});
