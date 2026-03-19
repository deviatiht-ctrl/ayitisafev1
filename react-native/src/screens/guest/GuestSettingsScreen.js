import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../store/appStore';
import { colors, fonts } from '../../theme';
import LockedFeatureModal from '../../components/LockedFeatureModal';

const LANGUAGES = [
  { key: 'kr', label: 'Kreyòl' },
  { key: 'fr', label: 'Français' },
  { key: 'en', label: 'English' },
];

export default function GuestSettingsScreen() {
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);
  const [lockedVisible, setLockedVisible] = useState(false);
  const [language, setLanguage] = useState('kr');
  const [darkMode, setDarkMode] = useState(false);

  const handleLogoutGuest = () => {
    Alert.alert(
      'Kite Mòd Envite',
      'Ou vle kite mòd envite a?',
      [
        { text: 'Anile', style: 'cancel' },
        {
          text: 'Wi, Kite',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('guestMode');
            setAppFlowState('auth');
          },
        },
      ]
    );
  };

  const SettingRow = ({ icon, label, locked, onPress, right }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={locked ? () => setLockedVisible(true) : onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={locked ? '#CBD5E1' : colors.primary} />
        <Text style={[styles.settingLabel, locked && { color: '#CBD5E1' }]}>{label}</Text>
        {locked && (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
          </View>
        )}
      </View>
      {right || <Ionicons name="chevron-forward" size={18} color={locked ? '#CBD5E1' : '#9CA3AF'} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Paramèt</Text>

        {/* Accessible Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Jeneral</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Lang</Text>
            <View style={styles.langRow}>
              {LANGUAGES.map((l) => (
                <TouchableOpacity
                  key={l.key}
                  style={[styles.langBtn, language === l.key && styles.langBtnActive]}
                  onPress={async () => {
                    setLanguage(l.key);
                    await AsyncStorage.setItem('appLanguage', l.key);
                  }}
                >
                  <Text style={[styles.langText, language === l.key && styles.langTextActive]}>{l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <SettingRow
              icon={darkMode ? 'moon' : 'sunny'}
              label={darkMode ? 'Mòd Fènwa' : 'Mòd Klè'}
              onPress={async () => {
                const next = !darkMode;
                setDarkMode(next);
                await AsyncStorage.setItem('darkMode', String(next));
              }}
              right={
                <TouchableOpacity
                  style={[styles.toggle, darkMode && styles.toggleOn]}
                  onPress={async () => {
                    const next = !darkMode;
                    setDarkMode(next);
                    await AsyncStorage.setItem('darkMode', String(next));
                  }}
                >
                  <View style={[styles.toggleThumb, darkMode && styles.toggleThumbOn]} />
                </TouchableOpacity>
              }
            />
            <SettingRow icon="information-circle" label="Konsènan AyitiSafe" onPress={() => {}} />
          </View>
        </View>

        {/* Locked Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kont</Text>
          <View style={styles.card}>
            <SettingRow icon="notifications" label="Notifikasyon" locked />
            <SettingRow icon="people" label="Kontak Dijans" locked />
            <SettingRow icon="eye-off" label="Mòd Kamouflaj" locked />
            <SettingRow icon="shield-checkmark" label="Pwivasi" locked />
          </View>
        </View>

        {/* Upgrade Card */}
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Debloke Tout AyitiSafe</Text>
          <Text style={styles.upgradeBody}>Kreye yon kont gratis pou aksede tout fonksyon yo</Text>
          <View style={styles.upgradeBullets}>
            {['Alèt pèsonalize', 'Rapòte ensidan', 'Wout sekirize', 'Mòd Kamouflaj'].map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.safe} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.btnOrange}
            onPress={() => setAppFlowState('auth')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOrangeText}>Kreye Kont Gratis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => setAppFlowState('auth')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>Konekte</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Guest */}
        <TouchableOpacity style={styles.logoutWrap} onPress={handleLogoutGuest}>
          <Text style={styles.logoutText}>Dékonekte Mòd Envite</Text>
        </TouchableOpacity>
      </ScrollView>

      <LockedFeatureModal visible={lockedVisible} onClose={() => setLockedVisible(false)} />
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
    backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 20,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginBottom: 8 },
  langRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  langBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F4F6F9',
    alignItems: 'center',
  },
  langBtnActive: { backgroundColor: colors.accent },
  langText: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B' },
  langTextActive: { color: '#FFFFFF' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F4F6F9',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  lockBadge: { marginLeft: 4 },
  toggle: {
    width: 44, height: 24, borderRadius: 12, backgroundColor: '#E2E8F0',
    justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: colors.accent },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF',
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  upgradeCard: {
    backgroundColor: '#FFF7ED', borderRadius: 20, marginHorizontal: 20,
    marginTop: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)',
  },
  upgradeTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  upgradeBody: { fontFamily: fonts.regular, fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 16 },
  upgradeBullets: { gap: 8, marginBottom: 20 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bulletText: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary },
  btnOrange: {
    backgroundColor: colors.accent, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  btnOrangeText: { fontFamily: fonts.semibold, fontSize: 16, color: '#FFFFFF' },
  btnOutline: {
    height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  btnOutlineText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary },
  logoutWrap: { alignItems: 'center', marginTop: 24 },
  logoutText: { fontFamily: fonts.medium, fontSize: 14, color: colors.danger },
});
