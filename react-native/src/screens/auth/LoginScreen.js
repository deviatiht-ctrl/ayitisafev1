import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator,
  SafeAreaView, StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts } from '../../theme';

export default function LoginScreen({ navigation, onLoginSuccess, onGuest }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const passwordRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!phone.trim()) e.phone = 'Tanpri antre nimewo telefòn ou';
    if (!password.trim()) e.password = 'Tanpri antre modpas ou';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      if (phone === '0000' && password === '0000') {
        setErrors({ general: 'Nimewo oswa modpas enkòrèk' });
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('userToken', 'mock_token_123');
      await AsyncStorage.setItem('hasLaunched', 'true');
      await AsyncStorage.removeItem('guestMode');
      if (onLoginSuccess) onLoginSuccess();
    } catch {
      setErrors({ general: 'Yon erè rive. Eseye ankò.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    await AsyncStorage.setItem('guestMode', 'true');
    await AsyncStorage.setItem('hasLaunched', 'true');
    if (onGuest) onGuest();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            {navigation?.canGoBack?.() && (
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
            <View style={styles.logoRow}>
              <Image source={require('../../../assets/LOGO.jpg')} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.logoText}>AyitiSafe</Text>
            </View>
            <Text style={styles.headerSub}>Konekte nan kont ou</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bon Retou</Text>
            <Text style={styles.cardSub}>Antre enfòmasyon ou yo</Text>

            {errors.general && (
              <View style={styles.generalError}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {/* Phone Input */}
            <Text style={styles.label}>Nimewo Telefòn</Text>
            <View style={[styles.inputRow, phoneFocused && styles.inputFocused, errors.phone && styles.inputError]}>
              <Text style={styles.prefix}>+509</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.inputField}
                value={phone}
                onChangeText={(t) => { setPhone(t); setErrors((p) => ({ ...p, phone: null })); }}
                keyboardType="phone-pad"
                placeholder="XXXX-XXXX"
                placeholderTextColor="#9CA3AF"
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            {/* Password Input */}
            <Text style={[styles.label, { marginTop: 16 }]}>Modpas</Text>
            <View style={[styles.inputRow, passwordFocused && styles.inputFocused, errors.password && styles.inputError]}>
              <TextInput
                ref={passwordRef}
                style={[styles.inputField, { flex: 1 }]}
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, password: null })); }}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Forgot */}
            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => navigation?.navigate?.('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Bliye modpas ou?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity style={styles.btnOrange} onPress={handleLogin} activeOpacity={0.8} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnOrangeText}>Konekte</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>oswa</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.socialBtnText}>Kontinye ak Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity style={[styles.socialBtn, styles.appleBtn]} activeOpacity={0.7}>
                <Ionicons name="logo-apple" size={20} color="#FFF" />
                <Text style={[styles.socialBtnText, { color: '#FFF' }]}>Kontinye ak Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Pa gen kont? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('Register')}>
              <Text style={styles.bottomLink}>Kreye youn</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.guestWrap} onPress={handleGuest}>
            <Text style={styles.guestText}>Kontinye kòm Envite</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 8 },
  backBtn: { position: 'absolute', left: 20, top: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 44, height: 44, borderRadius: 22 },
  logoText: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary },
  headerSub: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.primary },
  cardSub: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 20 },
  generalError: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, padding: 10, backgroundColor: '#FEF2F2', borderRadius: 8 },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputFocused: { borderColor: colors.accent },
  inputError: { borderColor: colors.danger },
  prefix: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  divider: { width: 1, height: 24, backgroundColor: '#E2E8F0', marginHorizontal: 10 },
  inputField: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: 4 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: 8, marginBottom: 20 },
  forgotText: { fontFamily: fonts.medium, fontSize: 13, color: colors.accent },
  btnOrange: {
    backgroundColor: colors.accent,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOrangeText: { fontFamily: fonts.semibold, fontSize: 16, color: '#FFFFFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontFamily: fonts.regular, fontSize: 13, color: '#9CA3AF', marginHorizontal: 12 },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
    marginBottom: 10,
  },
  googleG: { fontFamily: fonts.bold, fontSize: 20, color: '#4285F4' },
  socialBtnText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
  appleBtn: { backgroundColor: '#000000', borderColor: '#000000' },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  bottomText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B' },
  bottomLink: { fontFamily: fonts.semibold, fontSize: 14, color: colors.accent },
  guestWrap: { alignItems: 'center', marginTop: 16 },
  guestText: { fontFamily: fonts.regular, fontSize: 13, color: '#94A3B8', textDecorationLine: 'underline' },
});
