import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguageStore } from '../../store/languageStore';
import { colors, fonts } from '../../theme';

// Modern Flag Icons
const FlagIcon = ({ code }) => {
  const flagStyles = {
    ht: { colors: ['#00209F', '#D21034'], icon: 'flag', secondaryColor: '#FFF' },
    fr: { colors: ['#002395', '#ED2939'], icon: 'flag', secondaryColor: '#FFF' },
    en: { colors: ['#3C3B6E', '#B22234'], icon: 'flag', secondaryColor: '#FFF' },
  };
  
  const flag = flagStyles[code] || flagStyles.en;
  
  return (
    <View style={flagIconStyles.container}>
      <LinearGradient
        colors={flag.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={flagIconStyles.gradient}
      >
        <Text style={flagIconStyles.code}>{code.toUpperCase()}</Text>
      </LinearGradient>
    </View>
  );
};

const flagIconStyles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  code: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

const LANGUAGES = [
  { code: 'ht', name: 'Kreyòl Ayisyen', subtitle: 'Lang prensipal', icon: 'globe' },
  { code: 'fr', name: 'Français', subtitle: 'French', icon: 'globe' },
  { code: 'en', name: 'English', subtitle: 'American English', icon: 'globe' },
];

export default function LanguageSelectionScreen({ onComplete }) {
  const [selected, setSelected] = useState('ht');
  const { setLanguage } = useLanguageStore();

  const handleContinue = () => {
    setLanguage(selected);
    if (onComplete) onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/LOGO.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>AyitiSafe</Text>
        <Text style={styles.tagline}>Sekirite Entèlijan pou Ayiti</Text>
      </View>

      {/* Language Selection */}
      <View style={styles.content}>
        <Text style={styles.title}>Chwazi Lang Ou</Text>
        <Text style={styles.subtitle}>Choose Your Language</Text>

        <View style={styles.languageList}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                selected === lang.code && styles.languageCardSelected,
              ]}
              onPress={() => setSelected(lang.code)}
              activeOpacity={0.7}
            >
              <FlagIcon code={lang.code} />
              <View style={styles.langInfo}>
                <Text style={[
                  styles.langName,
                  selected === lang.code && styles.langNameSelected,
                ]}>
                  {lang.name}
                </Text>
                <Text style={styles.langSubtitle}>{lang.subtitle}</Text>
              </View>
              {selected === lang.code && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>Kontinye / Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  appName: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primary,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  languageList: {
    gap: 12,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  languageCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFF7ED',
  },
  flag: {
    fontSize: 36,
    marginRight: 16,
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.primary,
  },
  langNameSelected: {
    color: colors.accent,
  },
  langSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  continueBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: '#FFFFFF',
  },
});
