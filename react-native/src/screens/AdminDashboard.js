import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

const STATS = [
  { label: 'Rapò Jodi a', value: '47', icon: 'document-text', color: colors.accent },
  { label: 'Zòn Danje', value: '12', icon: 'warning', color: colors.danger },
  { label: 'Zòn Sekirize', value: '23', icon: 'shield-checkmark', color: colors.safe },
  { label: 'Itilizatè Aktif', value: '1,247', icon: 'people', color: '#3B82F6' },
];

const RECENT = [
  { type: 'Tire', zone: 'Delmas 18', time: '2 min de sa', severity: 'high' },
  { type: 'Barikad', zone: 'Carrefour', time: '15 min de sa', severity: 'medium' },
  { type: 'Aksidan', zone: 'Pétion-Ville', time: '32 min de sa', severity: 'low' },
];

export default function AdminDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Tablo Bò Admin</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Reports */}
        <Text style={styles.sectionTitle}>Dènye Rapò yo</Text>
        <View style={styles.card}>
          {RECENT.map((r, i) => (
            <View key={i} style={[styles.reportRow, i > 0 && styles.reportRowBorder]}>
              <View style={[
                styles.severityDot,
                { backgroundColor: r.severity === 'high' ? colors.danger : r.severity === 'medium' ? colors.warning : colors.safe },
              ]} />
              <View style={styles.reportInfo}>
                <Text style={styles.reportType}>{r.type}</Text>
                <Text style={styles.reportZone}>{r.zone} · {r.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Aksyon Rapid</Text>
        <View style={styles.actionsRow}>
          {[
            { icon: 'megaphone', label: 'Voye Alèt', color: colors.danger },
            { icon: 'analytics', label: 'Rapò', color: colors.accent },
            { icon: 'map', label: 'Kat Chalè', color: '#3B82F6' },
          ].map((a, i) => (
            <TouchableOpacity key={i} style={styles.actionBtn} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '20' }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: {
    width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 10, justifyContent: 'center',
    alignItems: 'center', marginBottom: 8,
  },
  statValue: { fontFamily: fonts.bold, fontSize: 24, color: colors.primary },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: '#64748B', marginTop: 2 },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary, marginBottom: 10 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 4, marginBottom: 20,
  },
  reportRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12,
  },
  reportRowBorder: { borderTopWidth: 1, borderTopColor: '#F4F6F9' },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  reportInfo: { flex: 1 },
  reportType: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
  reportZone: { fontFamily: fonts.regular, fontSize: 12, color: '#64748B', marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    alignItems: 'center', gap: 8,
  },
  actionIcon: {
    width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
  },
  actionLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.primary },
});
