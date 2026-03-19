import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function StatsScreen({ navigation }) {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState({
    reportsSubmitted: 0,
    alertsViewed: 0,
    daysActive: 1,
    communityRank: 'Nouvo',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await AsyncStorage.getItem('userStats');
    if (data) setUserStats(JSON.parse(data));
  };

  const StatCard = ({ icon, value, label, color = colors.accent }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('statistics')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Your Stats */}
        <Text style={styles.sectionTitle}>{t('yourStats')}</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="document-text"
            value={userStats.reportsSubmitted}
            label={t('reportsSubmitted')}
            color={colors.accent}
          />
          <StatCard
            icon="eye"
            value={userStats.alertsViewed}
            label={t('alertsViewed')}
            color="#3B82F6"
          />
          <StatCard
            icon="calendar"
            value={userStats.daysActive}
            label={t('daysActive')}
            color={colors.safe}
          />
          <StatCard
            icon="trophy"
            value={userStats.communityRank}
            label={t('communityRank')}
            color="#F59E0B"
          />
        </View>

        {/* Community Stats */}
        <Text style={styles.sectionTitle}>{t('communityStats')}</Text>
        <View style={styles.communityCard}>
          <View style={styles.communityRow}>
            <View style={styles.communityItem}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={styles.communityValue}>12,547</Text>
              <Text style={styles.communityLabel}>{t('totalUsers')}</Text>
            </View>
            <View style={styles.communitySeparator} />
            <View style={styles.communityItem}>
              <Ionicons name="document-text" size={24} color={colors.primary} />
              <Text style={styles.communityValue}>3,892</Text>
              <Text style={styles.communityLabel}>{t('totalReports')}</Text>
            </View>
            <View style={styles.communitySeparator} />
            <View style={styles.communityItem}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.communityValue}>47</Text>
              <Text style={styles.communityLabel}>{t('activeZones')}</Text>
            </View>
          </View>
        </View>

        {/* Activity Chart Placeholder */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Aktivite Mwa Sa a</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartBars}>
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <View key={i} style={styles.chartBarContainer}>
                  <View style={[styles.chartBar, { height: h }]} />
                  <Text style={styles.chartDay}>
                    {['L', 'Ma', 'Me', 'J', 'V', 'S', 'D'][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementCard}>
          <View style={styles.achievementHeader}>
            <Ionicons name="ribbon" size={24} color="#F59E0B" />
            <Text style={styles.achievementTitle}>Pwochen Akonplisman</Text>
          </View>
          <View style={styles.achievementProgress}>
            <Text style={styles.achievementText}>Voye 5 rapò pou debloke "Gadyen Kominote"</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(userStats.reportsSubmitted / 5) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{userStats.reportsSubmitted}/5 rapò</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.primary },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.primary, marginBottom: 12, marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, alignItems: 'center',
  },
  statIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontFamily: fonts.bold, fontSize: 24, color: colors.primary },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: '#64748B', marginTop: 2, textAlign: 'center' },
  communityCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  communityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  communityItem: { alignItems: 'center', flex: 1 },
  communitySeparator: { width: 1, backgroundColor: '#E2E8F0' },
  communityValue: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary, marginTop: 8 },
  communityLabel: { fontFamily: fonts.regular, fontSize: 11, color: '#64748B', marginTop: 2, textAlign: 'center' },
  chartCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16 },
  chartTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary, marginBottom: 16 },
  chartPlaceholder: { height: 120 },
  chartBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  chartBarContainer: { alignItems: 'center' },
  chartBar: { width: 24, backgroundColor: colors.accent, borderRadius: 4 },
  chartDay: { fontFamily: fonts.regular, fontSize: 11, color: '#64748B', marginTop: 6 },
  achievementCard: { backgroundColor: '#FFFBEB', borderRadius: 16, padding: 16 },
  achievementHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  achievementTitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary },
  achievementProgress: {},
  achievementText: { fontFamily: fonts.regular, fontSize: 13, color: '#64748B', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 4 },
  progressText: { fontFamily: fonts.medium, fontSize: 12, color: '#64748B', marginTop: 6, textAlign: 'right' },
});
