import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, borderRadius } from '../theme';

const typeIcons = {
  shooting: 'flame',
  kidnapping: 'person-remove',
  accident: 'car',
  barricade: 'warning',
  protest: 'people',
  patrol: 'shield-checkmark',
  road_hazard: 'alert-circle',
  flood: 'water',
};

const severityColors = {
  critical: { bg: 'rgba(239,68,68,0.08)', border: colors.danger, badge: colors.danger },
  warning: { bg: 'rgba(245,158,11,0.08)', border: colors.warning, badge: colors.warning },
  safe: { bg: 'rgba(34,197,94,0.08)', border: colors.safe, badge: colors.safe },
};

const severityLabels = {
  critical: 'KRITIK',
  warning: 'ATANSYON',
  safe: 'SEKIRITE',
};

export default function AlertCard({ alert, onViewOnMap, onShare, style }) {
  const sev = severityColors[alert.severity] || severityColors.warning;
  const icon = typeIcons[alert.type] || 'alert-circle';

  return (
    <View style={[styles.card, { backgroundColor: sev.bg, borderLeftColor: sev.border }, style]}>
      <View style={styles.row}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: sev.border + '18' }]}>
          <Ionicons name={icon} size={20} color={sev.border} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>{alert.title}</Text>
            <View style={[styles.badge, { backgroundColor: sev.badge }]}>
              <Text style={styles.badgeText}>{severityLabels[alert.severity]}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={12} color={colors.textLight} />
            <Text style={styles.locationText}>{alert.location}, {alert.street}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Poste {alert.time}</Text>
            <View style={styles.aiRow}>
              <Ionicons name="sparkles" size={12} color={colors.accent} />
              <Text style={[styles.metaText, { color: colors.accent }]}>IA: {alert.aiScore}%</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={onViewOnMap} activeOpacity={0.7}>
              <Ionicons name="map-outline" size={14} color={colors.primary} />
              <Text style={styles.actionText}>Wè sou Kat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
              <Ionicons name="share-outline" size={14} color={colors.primary} />
              <Text style={styles.actionText}>Pataje Alèt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textLight,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 32,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  actionText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },
});
