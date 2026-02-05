import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlantCategory } from '../../types';
import { colors, spacing, typography, borderRadius, getCategoryColor } from '../../theme';

const categories: { id: PlantCategory; label: string; emoji: string; description: string }[] = [
  {
    id: 'veg',
    label: 'Vegetables',
    emoji: '🥬',
    description: 'Tomatoes, courgettes, beans, and more',
  },
  {
    id: 'herb',
    label: 'Herbs',
    emoji: '🌿',
    description: 'Basil, coriander, parsley, and more',
  },
  {
    id: 'fruit',
    label: 'Fruits',
    emoji: '🍓',
    description: 'Strawberries and other fruit plants',
  },
];

export default function SelectCategory() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCategorySelect = (category: PlantCategory) => {
    router.push({
      pathname: '/add/variety',
      params: { category },
    });
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>What are you growing?</Text>
        <Text style={styles.subtitle}>
          Select a category to see available plant varieties
        </Text>
      </View>

      <View style={styles.categories}>
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryCard,
              { borderLeftColor: getCategoryColor(category.id) },
              pressed && styles.categoryCardPressed,
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.cancelButton} onPress={handleClose}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
  },
  categories: {
    flex: 1,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  categoryCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  categoryEmoji: {
    fontSize: 40,
    marginRight: spacing.lg,
  },
  categoryContent: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  arrow: {
    fontSize: typography.sizes.xl,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  cancelButton: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  cancelText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
});
