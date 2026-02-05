import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlantCategory, PlantTemplate } from '../../types';
import { getPlantsByCategory, searchPlants } from '../../data/seedDatabase';
import { colors, spacing, typography, borderRadius, getCategoryColor } from '../../theme';

export default function SelectVariety() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category: PlantCategory }>();

  const [searchQuery, setSearchQuery] = useState('');

  const plants = useMemo(() => {
    if (searchQuery.trim()) {
      return searchPlants(searchQuery).filter(p => p.category === category);
    }
    return getPlantsByCategory(category as PlantCategory);
  }, [category, searchQuery]);

  const handlePlantSelect = (plant: PlantTemplate) => {
    router.push({
      pathname: '/add/confirm',
      params: {
        templateId: plant.id,
      },
    });
  };

  const categoryColor = getCategoryColor(category as PlantCategory);

  const renderPlantItem = ({ item }: { item: PlantTemplate }) => (
    <Pressable
      style={({ pressed }) => [
        styles.plantCard,
        pressed && styles.plantCardPressed,
      ]}
      onPress={() => handlePlantSelect(item)}
    >
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{item.name}</Text>
        <View style={styles.plantMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Germination:</Text>
            <Text style={styles.metaValue}>{item.daysToGermination} days</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>To harvest:</Text>
            <Text style={styles.metaValue}>~{item.daysToHarvest} days</Text>
          </View>
        </View>
        {item.notes && (
          <Text style={styles.plantNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
      <View style={[styles.indicator, { backgroundColor: categoryColor }]} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search varieties..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Plant List */}
      <FlatList
        data={plants}
        keyExtractor={item => item.id}
        renderItem={renderPlantItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              No plants found matching "{searchQuery}"
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.md,
  },
  clearText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  plantCardPressed: {
    opacity: 0.8,
  },
  plantInfo: {
    flex: 1,
    padding: spacing.lg,
  },
  plantName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  plantMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    marginRight: spacing.lg,
    marginBottom: spacing.xs,
  },
  metaLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  metaValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  plantNotes: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  indicator: {
    width: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
