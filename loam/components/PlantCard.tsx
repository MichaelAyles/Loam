import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Plant } from '../types';
import { colors, borderRadius, spacing, typography, getCategoryColor, shadows } from '../theme';
import { Card } from './ui/Card';
import { getCurrentStage, getStageDisplayInfo } from '../utils/tasks';
import { formatDate } from '../utils/dates';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
}

export function PlantCard({ plant, onPress }: PlantCardProps) {
  const stage = getCurrentStage(plant);
  const stageInfo = getStageDisplayInfo(stage);
  const categoryColor = getCategoryColor(plant.category);

  return (
    <Card style={styles.card} onPress={onPress} variant="elevated">
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />

      <View style={styles.content}>
        <Text style={styles.emoji}>{stageInfo.emoji}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {plant.name}
        </Text>
        <View style={styles.stageContainer}>
          <Text style={styles.stageLabel}>{stageInfo.label}</Text>
        </View>
        {plant.sowedIndoors && (
          <Text style={styles.date}>
            Sowed: {formatDate(plant.sowedIndoors)}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 180,
    marginRight: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  categoryIndicator: {
    height: 4,
    width: '100%',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stageContainer: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  stageLabel: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
