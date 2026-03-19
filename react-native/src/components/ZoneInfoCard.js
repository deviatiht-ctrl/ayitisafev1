import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, borderRadius, shadows } from '../theme';

export default function ZoneInfoCard({ zone, onClose, onViewRoute, onReport }) {
  const riskLabel = zone.risk === 'critical' ? 'Danje Wo' : zone.risk === 'warning' ? 'Atansyon' : 'Sekirize';
  const riskColor = zone.risk === 'critical' ? colors.danger : zone.risk === 'warning' ? colors.warning : colors.safe;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
            <View>
              <Text style={styles.zoneName}>{zone.name}</Text>
              <Text style={[styles.riskLabel, { color: riskColor }]}>{riskLabel}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{zone.incidentCount}</Text>
            <Text style={styles.statLabel}>Ensidan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{zone.aiScore}%</Text>
            <Text style={styles.statLabel}>Skor IA</Text>
          </View>
        </View>

        {/* Last incident */}
        <View style={styles.lastIncident}>
          <Ionicons name="time-outline" size={14} color={colors.textLight} />
          <Text style={styles.lastIncidentText}>{zone.lastIncident}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.routeBtn} onPress={onViewRoute} activeOpacity={0.8}>
            <Ionicons name="navigate" size={16} color="#FFFFFF" />
            <Text style={styles.routeBtnText}>Wout Sekirize</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportBtn} onPress={onReport} activeOpacity={0.8}>
            <Ionicons name="warning" size={16} color={colors.accent} />
            <Text style={styles.reportBtnText}>Rapòte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: spacing.lg,
    right: spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.large,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  riskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  zoneName: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.primary,
  },
  riskLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  lastIncident: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  lastIncidentText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  routeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent,
  },
  routeBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  reportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: '#FFFFFF',
  },
  reportBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.accent,
  },
});
