import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Task } from '../types';
import { colors, borderRadius, spacing, typography } from '../theme';
import { formatDate, getRelativeDateString } from '../utils/dates';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onComplete: () => void;
}

export function TaskItem({ task, onPress, onComplete }: TaskItemProps) {
  const statusColor = task.isOverdue ? colors.error : colors.primary;
  const backgroundColor = task.isOverdue ? colors.errorLight : colors.primaryLight;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Pressable
        style={[styles.checkbox, { borderColor: statusColor }]}
        onPress={onComplete}
        hitSlop={8}
      >
        <View style={styles.checkboxInner} />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.plantName, { color: statusColor }]}>
            {task.plantName}
          </Text>
          <Text style={styles.separator}>·</Text>
          <Text style={[styles.dueDate, task.isOverdue && styles.overdue]}>
            {getRelativeDateString(task.dueDate)}
          </Text>
        </View>
      </View>

      {task.isOverdue && (
        <View style={styles.overdueIndicator}>
          <Text style={styles.overdueText}>!</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  separator: {
    marginHorizontal: spacing.xs,
    color: colors.textMuted,
  },
  dueDate: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  overdue: {
    color: colors.error,
    fontWeight: typography.weights.semibold,
  },
  overdueIndicator: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  overdueText: {
    color: colors.textOnPrimary,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.sm,
  },
});
