import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Linking, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function AboutScreen({ navigation }) {
  const { t } = useTranslation();

  const openLink = (url) => Linking.openURL(url);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('aboutApp')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Logo & Version */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/LOGO.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>AyitiSafe</Text>
          <Text style={styles.version}>{t('version')} 1.0.0</Text>
        </View>

        {/* About Text */}
        <View style={styles.card}>
          <Text style={styles.aboutText}>{t('aboutText')}</Text>
        </View>

        {/* Mission */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('mission')}</Text>
          <Text style={styles.sectionText}>{t('missionText')}</Text>
        </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('features')}</Text>
          <View style={styles.featureRow}>
            <Ionicons name="map" size={18} color={colors.accent} />
            <Text style={styles.featureText}>{t('feature1')}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="notifications" size={18} color={colors.accent} />
            <Text style={styles.featureText}>{t('feature2')}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="document-text" size={18} color={colors.accent} />
            <Text style={styles.featureText}>{t('feature3')}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="navigate" size={18} color={colors.accent} />
            <Text style={styles.featureText}>{t('feature4')}</Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://ayitisafe.com')}>
            <Ionicons name="globe" size={20} color={colors.primary} />
            <Text style={styles.linkText}>{t('website')}</Text>
            <Ionicons name="open-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://ayitisafe.com/terms')}>
            <Ionicons name="document" size={20} color={colors.primary} />
            <Text style={styles.linkText}>{t('termsOfService')}</Text>
            <Ionicons name="open-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://ayitisafe.com/privacy')}>
            <Ionicons name="shield" size={20} color={colors.primary} />
            <Text style={styles.linkText}>{t('privacyPolicy')}</Text>
            <Ionicons name="open-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>© 2024 AyitiSafe. Tout dwa rezève.</Text>
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
  logoSection: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  appName: { fontFamily: fonts.bold, fontSize: 24, color: colors.primary },
  version: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  aboutText: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary, lineHeight: 22 },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.primary, marginBottom: 12 },
  sectionText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', lineHeight: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureText: { fontFamily: fonts.regular, fontSize: 14, color: colors.primary },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F4F6F9',
  },
  linkText: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.primary, marginLeft: 12 },
  copyright: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 16 },
});
