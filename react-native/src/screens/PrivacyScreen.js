import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function PrivacyScreen({ navigation }) {
  const { t } = useTranslation();
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);
  const [settings, setSettings] = useState({
    shareLocation: false,
    anonymousReports: true,
    dataCollection: true,
  });

  useEffect(() => {
    AsyncStorage.getItem('privacySettings').then((data) => {
      if (data) setSettings(JSON.parse(data));
    });
  }, []);

  const toggleSetting = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await AsyncStorage.setItem('privacySettings', JSON.stringify(newSettings));
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('deleteAccount'), t('deleteAccountConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          setAppFlowState('language');
        },
      },
    ]);
  };

  const SettingRow = ({ icon, title, subtitle, settingKey }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.toggle, settings[settingKey] && styles.toggleOn]}
        onPress={() => toggleSetting(settingKey)}
      >
        <View style={[styles.toggleThumb, settings[settingKey] && styles.toggleThumbOn]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('privacy')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <SettingRow
            icon="location"
            title={t('shareLocation')}
            subtitle={t('shareLocationDesc')}
            settingKey="shareLocation"
          />
          <SettingRow
            icon="eye-off"
            title={t('anonymousReports')}
            subtitle={t('anonymousDesc')}
            settingKey="anonymousReports"
          />
          <SettingRow
            icon="analytics"
            title={t('dataCollection')}
            subtitle={t('dataDesc')}
            settingKey="dataCollection"
          />
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Ionicons name="trash" size={20} color={colors.danger} />
          <Text style={styles.deleteBtnText}>{t('deleteAccount')}</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 4, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F4F6F9',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingInfo: { flex: 1 },
  settingTitle: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  settingSubtitle: { fontFamily: fonts.regular, fontSize: 12, color: '#64748B', marginTop: 2 },
  toggle: {
    width: 48, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0',
    justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: colors.accent },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderWidth: 1.5, borderColor: colors.danger, borderRadius: 14,
  },
  deleteBtnText: { fontFamily: fonts.medium, fontSize: 15, color: colors.danger },
});
