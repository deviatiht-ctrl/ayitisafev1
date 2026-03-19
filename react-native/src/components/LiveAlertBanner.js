import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';

export default function LiveAlertBanner({ message, severity, onDismiss }) {
  const bgColor = severity === 'critical' ? colors.danger : severity === 'warning' ? colors.warning : colors.safe;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.row}>
        <View style={styles.pulse} />
        <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
        <Text style={styles.text} numberOfLines={1}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: spacing.sm,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  text: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: '#FFFFFF',
  },
});
