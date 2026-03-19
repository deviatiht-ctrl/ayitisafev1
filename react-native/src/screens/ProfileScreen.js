import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/appStore';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);
  const [profile, setProfile] = useState({ name: 'Itilizatè', phone: '+509 XXXX-XXXX' });

  const MENU_ITEMS = [
    { icon: 'person-circle', label: t('editProfile'), screen: 'EditProfile' },
    { icon: 'people', label: t('emergencyContacts'), screen: 'EmergencyContacts' },
    { icon: 'document-text', label: t('myReports'), screen: 'MyReports' },
    { icon: 'stats-chart', label: t('statistics'), screen: 'Stats' },
    { icon: 'settings', label: t('settings'), screen: 'Settings' },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', loadProfile);
    return unsubscribe;
  }, [navigation]);

  const loadProfile = () => {
    AsyncStorage.getItem('userProfile').then((data) => {
      if (data) setProfile(JSON.parse(data));
    });
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('profile')}</Text>

        {/* Avatar card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#9CA3AF" />
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userPhone}>{profile.phone}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil" size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Security badge */}
        <View style={styles.securityBadge}>
          <View style={styles.securityLeft}>
            <Ionicons name="shield-checkmark" size={24} color={colors.safe} />
            <View>
              <Text style={styles.securityTitle}>{t('securityLevel')}</Text>
              <Text style={styles.securityValue}>{t('good')} — 78/100</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '78%' }]} />
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.menuRow, i > 0 && styles.menuRowBorder]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={22} color={colors.primary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Admin access */}
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate('AdminDashboard')}
          activeOpacity={0.7}
        >
          <Ionicons name="analytics" size={20} color={colors.accent} />
          <Text style={styles.adminText}>{t('adminDashboard')}</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.primary, marginBottom: 16 },
  avatarCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#F4F6F9',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInfo: { flex: 1, marginLeft: 12 },
  userName: { fontFamily: fonts.semibold, fontSize: 18, color: colors.primary },
  userPhone: { fontFamily: fonts.regular, fontSize: 13, color: '#64748B', marginTop: 2 },
  editBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF7ED',
    justifyContent: 'center', alignItems: 'center',
  },
  securityBadge: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12,
  },
  securityLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  securityTitle: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B' },
  securityValue: { fontFamily: fonts.semibold, fontSize: 15, color: colors.safe },
  progressBarBg: { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' },
  progressBarFill: { height: 6, borderRadius: 3, backgroundColor: colors.safe },
  menuCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 4, marginBottom: 12 },
  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12,
  },
  menuRowBorder: { borderTopWidth: 1, borderTopColor: '#F4F6F9' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  adminBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#FFF7ED', borderRadius: 14, height: 48, marginBottom: 12,
  },
  adminText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.accent },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 48,
  },
  logoutText: { fontFamily: fonts.medium, fontSize: 14, color: colors.danger },
});
