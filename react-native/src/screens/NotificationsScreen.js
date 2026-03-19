import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function NotificationsScreen({ navigation }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    push: true,
    alerts: true,
    sound: true,
    vibration: true,
    quietHours: false,
    nearby: true,
  });

  useEffect(() => {
    AsyncStorage.getItem('notificationSettings').then((data) => {
      if (data) setSettings(JSON.parse(data));
    });
  }, []);

  const toggleSetting = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
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
        <Text style={styles.headerTitle}>{t('notifications')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <SettingRow
            icon="notifications"
            title={t('pushNotifications')}
            settingKey="push"
          />
          <SettingRow
            icon="warning"
            title={t('alertNotifications')}
            settingKey="alerts"
          />
          <SettingRow
            icon="volume-high"
            title={t('soundEnabled')}
            settingKey="sound"
          />
          <SettingRow
            icon="phone-portrait"
            title={t('vibrationEnabled')}
            settingKey="vibration"
          />
        </View>

        <View style={styles.card}>
          <SettingRow
            icon="moon"
            title={t('quietHours')}
            subtitle={t('quietHoursDesc')}
            settingKey="quietHours"
          />
          <SettingRow
            icon="location"
            title={t('nearbyAlerts')}
            subtitle={t('nearbyDesc')}
            settingKey="nearby"
          />
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
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 4, marginBottom: 16,
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
});
