import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addDays, parseISO } from 'date-fns';
import { getPlantTemplateById } from '../../data/seedDatabase';
import { usePlants } from '../../hooks/usePlants';
import { useSettings } from '../../hooks/useSettings';
import { colors, spacing, typography, borderRadius, getCategoryColor } from '../../theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/dates';

export default function ConfirmDates() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const { settings } = useSettings();
  const { addPlant } = usePlants();

  const template = getPlantTemplateById(templateId);

  // Default sow date based on template recommendation
  const getDefaultSowDate = (): Date => {
    if (template?.sowIndoorsWeeksBefore) {
      const frostDate = parseISO(settings.lastFrostDate);
      return addDays(frostDate, -template.sowIndoorsWeeksBefore * 7);
    }
    return new Date();
  };

  const [sowDate, setSowDate] = useState(getDefaultSowDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculate all expected dates
  const expectedDates = useMemo(() => {
    if (!template) return null;

    const frostDate = parseISO(settings.lastFrostDate);
    const germination = addDays(sowDate, template.daysToGermination);
    const transplant = addDays(germination, template.daysToTransplant);
    const plantOut = addDays(frostDate, template.daysToPlantOut);
    const hardenOff = addDays(plantOut, -template.daysToHardenOff);
    const harvest = addDays(plantOut, template.daysToHarvest);

    return {
      sow: sowDate,
      germination,
      transplant,
      hardenOff,
      plantOut,
      harvest,
    };
  }, [sowDate, template, settings.lastFrostDate]);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSowDate(date);
    }
  };

  const handleSave = async () => {
    if (!template) return;

    setSaving(true);
    try {
      await addPlant(template, sowDate.toISOString());
      // Navigate back to home
      router.dismissTo('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save plant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!template) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plant template not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const categoryColor = getCategoryColor(template.category);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing['2xl'] }}
    >
      {/* Plant Info */}
      <Card style={styles.plantCard}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>
            {template.category.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.plantName}>{template.name}</Text>
        {template.notes && (
          <Text style={styles.plantNotes}>{template.notes}</Text>
        )}
      </Card>

      {/* Sow Date Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>When did you sow?</Text>
        <Card>
          <View style={styles.datePickerRow}>
            <View>
              <Text style={styles.dateLabel}>Sow Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(sowDate, 'EEEE, MMMM d, yyyy')}
              </Text>
            </View>
            <Button
              title="Change"
              variant="outline"
              size="sm"
              onPress={() => setShowDatePicker(true)}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={sowDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {template.sowIndoorsWeeksBefore && (
            <Text style={styles.hint}>
              Recommended: {template.sowIndoorsWeeksBefore} weeks before last frost
              ({formatDate(getDefaultSowDate(), 'MMM d')})
            </Text>
          )}
        </Card>
      </View>

      {/* Expected Schedule */}
      {expectedDates && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expected Schedule</Text>
          <Card>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleEmoji}>🌱</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Sow Indoors</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(expectedDates.sow, 'MMM d, yyyy')}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleLine} />

            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleEmoji}>🌿</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Expected Germination</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(expectedDates.germination, 'MMM d, yyyy')}
                </Text>
                <Text style={styles.scheduleDays}>
                  ({template.daysToGermination} days after sowing)
                </Text>
              </View>
            </View>

            <View style={styles.scheduleLine} />

            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleEmoji}>🪴</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Transplant to Pots</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(expectedDates.transplant, 'MMM d, yyyy')}
                </Text>
                <Text style={styles.scheduleDays}>
                  ({template.daysToTransplant} days after germination)
                </Text>
              </View>
            </View>

            <View style={styles.scheduleLine} />

            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleEmoji}>💪</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Start Hardening Off</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(expectedDates.hardenOff, 'MMM d, yyyy')}
                </Text>
                <Text style={styles.scheduleDays}>
                  ({template.daysToHardenOff} days before plant out)
                </Text>
              </View>
            </View>

            <View style={styles.scheduleLine} />

            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleEmoji}>🏡</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>Plant Out</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(expectedDates.plantOut, 'MMM d, yyyy')}
                </Text>
                <Text style={styles.scheduleDays}>
                  {template.daysToPlantOut >= 0
                    ? `(${template.daysToPlantOut} days after last frost)`
                    : `(${Math.abs(template.daysToPlantOut)} days before last frost)`}
                </Text>
              </View>
            </View>

            <View style={styles.scheduleLine} />

            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleEmoji}>🥬</Text>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleLabel}>First Harvest</Text>
                <Text style={styles.scheduleDate}>
                  {formatDate(expectedDates.harvest, 'MMM d, yyyy')}
                </Text>
                <Text style={styles.scheduleDays}>
                  (~{template.daysToHarvest} days after plant out)
                </Text>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Add Plant"
          onPress={handleSave}
          loading={saving}
          fullWidth
          size="lg"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  plantCard: {
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
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  plantNotes: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
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
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dateValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  hint: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  scheduleEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
    textAlign: 'center',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  scheduleDate: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
  },
  scheduleDays: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  scheduleLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.border,
    marginLeft: 15,
  },
  buttonContainer: {
    padding: spacing.lg,
  },
});
