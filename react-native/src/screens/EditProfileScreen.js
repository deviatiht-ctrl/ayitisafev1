import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

export default function EditProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userProfile').then((data) => {
      if (data) {
        const profile = JSON.parse(data);
        setName(profile.name || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
      }
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('error'), t('fullName') + ' obligatwa');
      return;
    }
    setLoading(true);
    try {
      const profile = { name, phone, email };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert(t('success'), t('saveChanges') + ' avèk siksè', [
        { text: t('ok'), onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert(t('error'), 'Pa kapab anrejistre');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editProfile')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={50} color="#9CA3AF" />
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={16} color={colors.accent} />
            <Text style={styles.changePhotoText}>{t('changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>{t('fullName')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('fullName')}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>{t('phone')}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+509 XXXX-XXXX"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>{t('saveChanges')}</Text>
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
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#F4F6F9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  changePhotoText: { fontFamily: fonts.medium, fontSize: 14, color: colors.accent },
  form: { gap: 4 },
  label: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0',
    padding: 14, fontFamily: fonts.regular, fontSize: 15, color: colors.primary,
  },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: 14, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 32,
  },
  saveBtnText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFF' },
});
