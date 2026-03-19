import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

const TABS = ['all', 'pending', 'verified', 'rejected'];

export default function MyReportsScreen({ navigation }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const data = await AsyncStorage.getItem('userReports');
    if (data) setReports(JSON.parse(data));
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'all': return t('all');
      case 'pending': return t('pendingReports');
      case 'verified': return t('verifiedReports');
      case 'rejected': return t('rejectedReports');
      default: return tab;
    }
  };

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return colors.safe;
      case 'rejected': return colors.danger;
      default: return colors.warning;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'shooting': return 'flame';
      case 'barricade': return 'warning';
      case 'accident': return 'car';
      case 'theft': return 'hand-left';
      case 'flood': return 'water';
      default: return 'alert-circle';
    }
  };

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={[styles.typeIcon, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Ionicons name={getTypeIcon(item.type)} size={22} color={getStatusColor(item.status)} />
      </View>
      <View style={styles.reportInfo}>
        <Text style={styles.reportType}>{t(item.type)}</Text>
        <Text style={styles.reportLocation}>{item.location || 'Kote enkoni'}</Text>
        <Text style={styles.reportDate}>{item.date}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {t(item.status + 'Reports')}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myReports')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {getTabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>{t('noReportsYet')}</Text>
          <Text style={styles.emptyText}>{t('startReporting')}</Text>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate('Report')}
          >
            <Ionicons name="add-circle" size={20} color="#FFF" />
            <Text style={styles.reportBtnText}>{t('reportIncident')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderReport}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  tabsContainer: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8,
  },
  tab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F4F6F9',
  },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B' },
  tabTextActive: { color: '#FFF' },
  listContent: { padding: 16 },
  reportCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 14, padding: 14, marginBottom: 12,
  },
  typeIcon: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  reportInfo: { flex: 1, marginLeft: 12 },
  reportType: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.primary },
  reportLocation: { fontFamily: fonts.regular, fontSize: 13, color: '#64748B', marginTop: 2 },
  reportDate: { fontFamily: fonts.regular, fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontFamily: fonts.medium, fontSize: 11 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.primary, marginTop: 16 },
  emptyText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center' },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.accent,
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 24,
  },
  reportBtnText: { fontFamily: fonts.semiBold, fontSize: 14, color: '#FFF' },
});
