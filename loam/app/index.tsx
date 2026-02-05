import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlants } from '../hooks/usePlants';
import { useSettings } from '../hooks/useSettings';
import { useTasks } from '../hooks/useTasks';
import { colors, spacing, typography, borderRadius } from '../theme';
import { PlantCard } from '../components/PlantCard';
import { TaskItem } from '../components/TaskItem';
import { FAB } from '../components/FAB';
import { formatDateLong } from '../utils/dates';

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plants, loading, refreshPlants, recordEvent } = usePlants();
  const { settings } = useSettings();
  const { tasks, overdueTasks, todayTasks, upcomingTasks } = useTasks(
    plants,
    settings.lastFrostDate
  );

  const handleAddPlant = () => {
    router.push('/add');
  };

  const handlePlantPress = (plantId: string) => {
    router.push(`/plant/${plantId}`);
  };

  const handleTaskPress = (plantId: string) => {
    router.push(`/plant/${plantId}`);
  };

  const handleTaskComplete = async (task: typeof tasks[0]) => {
    // Map task type to event type
    const eventTypeMap: Record<string, 'germinated' | 'transplanted' | 'hardened' | 'planted-out' | 'harvested'> = {
      'check-germination': 'germinated',
      'transplant': 'transplanted',
      'start-hardening': 'hardened',
      'plant-out': 'planted-out',
      'check-harvest': 'harvested',
    };

    const eventType = eventTypeMap[task.type];
    if (eventType) {
      await recordEvent(task.plantId, eventType);
    }
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshPlants}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{formatDateLong(new Date())}</Text>
            <Text style={styles.location}>{settings.location}</Text>
          </View>
          <Pressable onPress={handleSettingsPress} style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* Tasks Section */}
        {tasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Tasks
              {overdueTasks.length > 0 && (
                <Text style={styles.overdueCount}> ({overdueTasks.length} overdue)</Text>
              )}
            </Text>

            {tasks.slice(0, 5).map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.plantId)}
                onComplete={() => handleTaskComplete(task)}
              />
            ))}

            {tasks.length > 5 && (
              <Text style={styles.moreTasksText}>
                +{tasks.length - 5} more tasks
              </Text>
            )}
          </View>
        )}

        {/* Empty state for tasks */}
        {tasks.length === 0 && plants.length > 0 && (
          <View style={styles.emptyTasks}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>
              No tasks due right now. Check back soon.
            </Text>
          </View>
        )}

        {/* Plants Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Your Plants ({plants.length})
          </Text>

          {plants.length > 0 ? (
            <FlatList
              horizontal
              data={plants}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <PlantCard
                  plant={item}
                  onPress={() => handlePlantPress(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plantsList}
            />
          ) : (
            <View style={styles.emptyPlants}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>No plants yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to add your first plant
              </Text>
            </View>
          )}
        </View>

        {/* Quick Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Growing Season Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Frost:</Text>
              <Text style={styles.infoValue}>
                {new Date(settings.lastFrostDate).toLocaleDateString('en-GB', {
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>First Frost:</Text>
              <Text style={styles.infoValue}>
                {new Date(settings.firstFrostDate).toLocaleDateString('en-GB', {
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <FAB onPress={handleAddPlant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['2xl'],
    marginTop: spacing.lg,
  },
  date: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  location: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  overdueCount: {
    color: colors.error,
    fontWeight: typography.weights.normal,
  },
  moreTasksText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  plantsList: {
    paddingRight: spacing.lg,
  },
  emptyTasks: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.xl,
    marginBottom: spacing['2xl'],
  },
  emptyPlants: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
  },
  infoTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
});
