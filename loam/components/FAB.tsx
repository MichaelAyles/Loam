import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { colors, borderRadius, shadows } from '../theme';

interface FABProps {
  onPress: () => void;
  icon?: string;
}

export function FAB({ onPress, icon = '+' }: FABProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  pressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
  icon: {
    fontSize: 32,
    color: colors.textOnPrimary,
    fontWeight: '300',
    lineHeight: 36,
  },
});
