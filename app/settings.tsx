import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { colors, spacing, typography, borderRadius } from '../theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { clearAllData } from '../data/storage';
import { useRouter } from 'expo-router';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSettings, resetSettings } = useSettings();

  const [location, setLocation] = useState(settings.location);
  const [showLastFrostPicker, setShowLastFrostPicker] = useState(false);
  const [showFirstFrostPicker, setShowFirstFrostPicker] = useState(false);

  const handleLocationSave = async () => {
    await updateSettings({ location });
  };

  const handleLastFrostChange = async (event: any, date?: Date) => {
    setShowLastFrostPicker(Platform.OS === 'ios');
    if (date) {
      await updateSettings({ lastFrostDate: date.toISOString() });
    }
  };

  const handleFirstFrostChange = async (event: any, date?: Date) => {
    setShowFirstFrostPicker(Platform.OS === 'ios');
    if (date) {
      await updateSettings({ firstFrostDate: date.toISOString() });
    }
  };

  const handleManualDatesToggle = async (value: boolean) => {
    await updateSettings({ useManualDates: value });
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetSettings();
            setLocation('United Kingdom');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your plants and settings. This cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            router.replace('/');
          },
        },
      ]
    );
  };

  const formatFrostDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing['2xl'] }}
    >
      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Card>
          <Input
            label="Your Location"
            value={location}
            onChangeText={setLocation}
            onBlur={handleLocationSave}
            placeholder="e.g., London, UK"
          />
          <Text style={styles.hint}>
            Used for display purposes. Frost dates are set manually below.
          </Text>
        </Card>
      </View>

      {/* Frost Dates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frost Dates</Text>
        <Card>
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <Text style={styles.label}>Use Manual Dates</Text>
              <Text style={styles.sublabel}>
                Override automatic frost date estimates
              </Text>
            </View>
            <Switch
              value={settings.useManualDates}
              onValueChange={handleManualDatesToggle}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={settings.useManualDates ? colors.primary : colors.textLight}
            />
          </View>

          <View style={styles.divider} />

          {/* Last Frost Date */}
          <View style={styles.dateRow}>
            <View style={styles.dateInfo}>
              <Text style={styles.label}>Last Frost (Spring)</Text>
              <Text style={styles.dateValue}>
                {formatFrostDate(settings.lastFrostDate)}
              </Text>
            </View>
            <Button
              title="Change"
              variant="outline"
              size="sm"
              onPress={() => setShowLastFrostPicker(true)}
            />
          </View>

          {showLastFrostPicker && (
            <DateTimePicker
              value={new Date(settings.lastFrostDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleLastFrostChange}
            />
          )}

          <View style={styles.divider} />

          {/* First Frost Date */}
          <View style={styles.dateRow}>
            <View style={styles.dateInfo}>
              <Text style={styles.label}>First Frost (Autumn)</Text>
              <Text style={styles.dateValue}>
                {formatFrostDate(settings.firstFrostDate)}
              </Text>
            </View>
            <Button
              title="Change"
              variant="outline"
              size="sm"
              onPress={() => setShowFirstFrostPicker(true)}
            />
          </View>

          {showFirstFrostPicker && (
            <DateTimePicker
              value={new Date(settings.firstFrostDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleFirstFrostChange}
            />
          )}

          <Text style={styles.hint}>
            UK default: Last frost mid-May, first frost mid-October. Adjust based on
            your local climate.
          </Text>
        </Card>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Card>
          <Text style={styles.appName}>Loam</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            A simple garden planning app for tracking your plants from seed to
            harvest. Built for UK growing conditions.
          </Text>
        </Card>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <Card>
          <Button
            title="Reset Settings"
            variant="outline"
            onPress={handleResetSettings}
            style={styles.dangerButton}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Clear All Data"
            variant="outline"
            onPress={handleClearAllData}
            style={styles.dangerButton}
            textStyle={styles.dangerButtonText}
          />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  sublabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInfo: {
    flex: 1,
  },
  dateValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  hint: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
    lineHeight: 20,
  },
  appName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  version: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  dangerButton: {
    borderColor: colors.error,
  },
  dangerButtonText: {
    color: colors.error,
  },
  buttonSpacer: {
    height: spacing.md,
  },
});
