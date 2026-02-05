import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plant, PlantEvent } from '../../types';
import { getPlantById, updatePlant, deletePlant } from '../../data/storage';
import { useSettings } from '../../hooks/useSettings';
import { colors, spacing, typography, borderRadius, getCategoryColor } from '../../theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Timeline } from '../../components/Timeline';
import { getCurrentStage, getStageDisplayInfo, deriveTasksForPlant } from '../../utils/tasks';
import { formatDate, getRelativeDateString } from '../../utils/dates';
import { generateId } from '../../data/storage';

export default function PlantProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlant();
  }, [id]);

  const loadPlant = async () => {
    if (!id) return;
    try {
      const data = await getPlantById(id);
      setPlant(data);
    } catch (error) {
      console.error('Error loading plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordEvent = async (
    eventType: PlantEvent['type'],
    note?: string
  ) => {
    if (!plant) return;

    const now = new Date().toISOString();
    const event: PlantEvent = {
      id: generateId(),
      date: now,
      type: eventType,
      note,
    };

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

    try {
      await updatePlant(updatedPlant);
      setPlant(updatedPlant);
    } catch (error) {
      Alert.alert('Error', 'Failed to record event');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to delete ${plant?.name}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (plant) {
              await deletePlant(plant.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plant not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const stage = getCurrentStage(plant);
  const stageInfo = getStageDisplayInfo(stage);
  const categoryColor = getCategoryColor(plant.category);
  const tasks = deriveTasksForPlant(plant, settings.lastFrostDate);
  const nextTask = tasks[0];

  // Determine next action based on current stage
  const getNextAction = (): {
    label: string;
    eventType: PlantEvent['type'];
  } | null => {
    if (!plant.germinatedDate) {
      return { label: 'Mark as Germinated', eventType: 'germinated' };
    }
    if (!plant.transplantedDate) {
      return { label: 'Mark as Transplanted', eventType: 'transplanted' };
    }
    if (!plant.hardenedOffDate) {
      return { label: 'Start Hardening Off', eventType: 'hardened' };
    }
    if (!plant.plantedOutDate) {
      return { label: 'Mark as Planted Out', eventType: 'planted-out' };
    }
    return { label: 'Record Harvest', eventType: 'harvested' };
  };

  const nextAction = getNextAction();

  return (
    <>
      <Stack.Screen
        options={{
          title: plant.name.split(' - ')[0],
          headerRight: () => (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing['2xl'] }}
      >
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>
              {plant.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.plantName}>{plant.name}</Text>
          <View style={styles.stageRow}>
            <Text style={styles.stageEmoji}>{stageInfo.emoji}</Text>
            <Text style={styles.stageText}>{stageInfo.label}</Text>
          </View>
        </Card>

        {/* Next Task Card */}
        {nextTask && (
          <Card
            style={[
              styles.taskCard,
              nextTask.isOverdue && styles.taskCardOverdue,
            ]}
          >
            <Text style={styles.taskTitle}>
              {nextTask.isOverdue ? '⚠️ Overdue Task' : '📋 Next Task'}
            </Text>
            <Text style={styles.taskDescription}>{nextTask.description}</Text>
            <Text style={styles.taskDate}>
              {getRelativeDateString(nextTask.dueDate)}
            </Text>
          </Card>
        )}

        {/* Quick Action */}
        {nextAction && (
          <View style={styles.actionSection}>
            <Button
              title={nextAction.label}
              onPress={() => handleRecordEvent(nextAction.eventType)}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Timeline</Text>
          <Card>
            <Timeline plant={plant} lastFrostDate={settings.lastFrostDate} />
          </Card>
        </View>

        {/* Event Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Log</Text>
          <Card>
            {plant.events.length > 0 ? (
              plant.events
                .slice()
                .reverse()
                .map(event => (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={styles.eventDot} />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventType}>
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1).replace('-', ' ')}
                      </Text>
                      <Text style={styles.eventDate}>
                        {formatDate(event.date, 'MMM d, yyyy')}
                      </Text>
                      {event.note && (
                        <Text style={styles.eventNote}>{event.note}</Text>
                      )}
                    </View>
                  </View>
                ))
            ) : (
              <Text style={styles.noEvents}>No events recorded yet</Text>
            )}
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing['2xl'],
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteIcon: {
    fontSize: 20,
  },
  headerCard: {
    margin: spacing.lg,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  categoryText: {
    color: colors.textOnPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  plantName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  stageText: {
    fontSize: typography.sizes.lg,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  taskCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.accentLight,
  },
  taskCardOverdue: {
    backgroundColor: colors.errorLight,
  },
  taskTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  taskDescription: {
    fontSize: typography.sizes.base,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  taskDate: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  actionSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  eventItem: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventType: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  eventDate: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  eventNote: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  noEvents: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
