import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '../theme';

const DEFAULT_CHIPS = [
  { id: 'all', label: 'Tout' },
  { id: 'danger', label: 'Danje', color: colors.danger },
  { id: 'safe', label: 'Sekirize', color: colors.safe },
  { id: 'routes', label: 'Wout', color: colors.accent },
];

export default function FilterChips({ chips, activeFilter, onSelect }) {
  const items = chips || DEFAULT_CHIPS;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((chip) => {
        const isActive = activeFilter === chip.id;
        return (
          <TouchableOpacity
            key={chip.id}
            style={[
              styles.chip,
              isActive && styles.chipActive,
              isActive && chip.color && { backgroundColor: chip.color },
            ]}
            onPress={() => onSelect(chip.id)}
            activeOpacity={0.7}
          >
            {chip.color && !isActive && (
              <View style={[styles.dot, { backgroundColor: chip.color }]} />
            )}
            <Text
              style={[
                styles.chipText,
                isActive && styles.chipTextActive,
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
