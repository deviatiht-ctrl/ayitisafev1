import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/appStore';
import { useCamouflageStore } from '../store/appStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

const LANGUAGES = [
  { key: 'ht', label: 'Kreyòl', colors: ['#00209F', '#D21034'] },
  { key: 'fr', label: 'Français', colors: ['#002395', '#ED2939'] },
  { key: 'en', label: 'English', colors: ['#3C3B6E', '#B22234'] },
];

export default function SettingsScreen({ navigation }) {
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);
  const { isActive: camouflageActive, setActive: setCamouflageActive } = useCamouflageStore();
  const { darkMode, setDarkMode } = useAppStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const handleToggleCamouflage = () => {
    if (!camouflageActive) {
      Alert.alert(
        t('activateCamouflage'),
        t('camouflageDesc'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('activate'),
            onPress: () => {
              setCamouflageActive(true);
              setAppFlowState('calculator');
            },
          },
        ]
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('guestMode');
          setAppFlowState('auth');
        },
      },
    ]);
  };

  const SettingRow = ({ icon, label, onPress, right, danger }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.primary} />
        <Text style={[styles.settingLabel, danger && { color: colors.danger }]}>{label}</Text>
      </View>
      {right || <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('settings')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('general')}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>{t('language')}</Text>
            <View style={styles.langRow}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.key}
                  style={[styles.langBtn, language === l.key && styles.langBtnActive]}
                  onPress={() => setLanguage(l.key)}
                >
                  <LinearGradient
                    colors={l.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.langIcon}
                  >
                    <Text style={styles.langCode}>{l.key.toUpperCase()}</Text>
                  </LinearGradient>
                  <Text style={[styles.langText, language === l.key && styles.langTextActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <SettingRow
              icon={darkMode ? 'moon' : 'sunny'}
              label={darkMode ? t('darkModeOn') : t('darkModeOff')}
              onPress={() => setDarkMode(!darkMode)}
              right={
                <TouchableOpacity
                  style={[styles.toggle, darkMode && styles.toggleOn]}
                  onPress={() => setDarkMode(!darkMode)}
                >
                  <View style={[styles.toggleThumb, darkMode && styles.toggleThumbOn]} />
                </TouchableOpacity>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('security')}</Text>
          <View style={styles.card}>
            <SettingRow 
              icon="notifications" 
              label={t('notifications')} 
              onPress={() => navigation.navigate('Notifications')} 
            />
            <SettingRow 
              icon="people" 
              label={t('emergencyContacts')} 
              onPress={() => navigation.navigate('EmergencyContacts')} 
            />
            <SettingRow
              icon="eye-off"
              label={t('camouflageMode')}
              onPress={handleToggleCamouflage}
              right={
                <TouchableOpacity
                  style={[styles.toggle, camouflageActive && styles.toggleOn]}
                  onPress={handleToggleCamouflage}
                >
                  <View style={[styles.toggleThumb, camouflageActive && styles.toggleThumbOn]} />
                </TouchableOpacity>
              }
            />
            <SettingRow 
              icon="shield-checkmark" 
              label={t('privacy')} 
              onPress={() => navigation.navigate('Privacy')} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('account')}</Text>
          <View style={styles.card}>
            <SettingRow 
              icon="information-circle" 
              label={t('aboutApp')} 
              onPress={() => navigation.navigate('About')} 
            />
            <SettingRow 
              icon="help-circle" 
              label={t('helpSupport')} 
              onPress={() => navigation.navigate('Help')} 
            />
            <SettingRow 
              icon="log-out" 
              label={t('logout')} 
              onPress={handleLogout} 
              danger 
            />
          </View>
        </View>

        <Text style={styles.version}>AyitiSafe v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  section: { marginTop: 16 },
  sectionLabel: { fontFamily: fonts.semibold, fontSize: 13, color: '#9CA3AF', paddingHorizontal: 20, marginBottom: 8, textTransform: 'uppercase' },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, marginHorizontal: 20,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginBottom: 8 },
  langRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  langBtn: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, backgroundColor: '#F4F6F9',
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
  },
  langBtnActive: { backgroundColor: '#FFF7ED', borderColor: colors.accent },
  langIcon: {
    width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  langCode: { fontFamily: fonts.bold, fontSize: 10, color: '#FFF', letterSpacing: 0.5 },
  langText: { fontFamily: fonts.medium, fontSize: 11, color: '#64748B' },
  langTextActive: { color: colors.accent, fontFamily: fonts.semiBold },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F4F6F9',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  toggle: {
    width: 44, height: 24, borderRadius: 12, backgroundColor: '#E2E8F0',
    justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: colors.accent },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF' },
  toggleThumbOn: { alignSelf: 'flex-end' },
  version: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 24 },
});
