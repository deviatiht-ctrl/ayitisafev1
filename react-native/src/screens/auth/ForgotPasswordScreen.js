import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, SafeAreaView,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, countdown]);

  const maskedPhone = phone ? `+509 ${phone.slice(0, 4)}-${phone.slice(4)}` : '';

  const handleSendCode = () => {
    if (!phone.trim() || phone.length < 8) {
      setErrors({ phone: 'Tanpri antre nimewo telefòn ou' });
      return;
    }
    setLoading(true);
    setErrors({});
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setCountdown(60);
      setCanResend(false);
    }, 1000);
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);
    if (text && index < 3) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyCode = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setErrors({ otp: 'Tanpri antre kòd 4 chif la' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handleResend = () => {
    setCanResend(false);
    setCountdown(60);
    setOtp(['', '', '', '']);
  };

  const handleChangePassword = () => {
    const e = {};
    if (newPassword.length < 8) e.newPassword = 'Modpas dwe gen omwen 8 karaktè';
    if (newPassword !== confirmPassword) e.confirmPassword = 'Modpas yo pa menm';
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation?.navigate?.('Login');
    }, 1000);
  };

  const renderStep1 = () => (
    <>
      <View style={styles.iconWrap}>
        <Ionicons name="lock-open-outline" size={48} color={colors.accent} />
      </View>
      <Text style={styles.title}>Rekipere Kont Ou</Text>
      <Text style={styles.subtitle}>Nou ap voye yon kòd verifikasyon</Text>

      <Text style={[styles.label, { marginTop: 24 }]}>Nimewo Telefòn</Text>
      <View style={[styles.inputRow, errors.phone && styles.inputErrorBorder]}>
        <Text style={styles.prefix}>+509</Text>
        <View style={styles.vertDivider} />
        <TextInput
          style={styles.inputField}
          value={phone}
          onChangeText={(t) => { setPhone(t); setErrors({}); }}
          keyboardType="phone-pad"
          placeholder="XXXX-XXXX"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <TouchableOpacity style={[styles.btnOrange, { marginTop: 24 }]} onPress={handleSendCode} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Voye Kòd</Text>}
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.iconWrap}>
        <Ionicons name="chatbubble-ellipses-outline" size={48} color={colors.accent} />
      </View>
      <Text style={styles.title}>Antre Kòd la</Text>
      <Text style={styles.subtitle}>Kòd 4 chif voye nan {maskedPhone}</Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={otpRefs[i]}
            style={[
              styles.otpBox,
              digit ? styles.otpBoxFilled : null,
              i === otp.findIndex((d) => !d) && !digit ? styles.otpBoxActive : null,
            ]}
            value={digit}
            onChangeText={(t) => handleOtpChange(t, i)}
            onKeyPress={(e) => handleOtpKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>
      {errors.otp && <Text style={[styles.errorText, { textAlign: 'center' }]}>{errors.otp}</Text>}

      <View style={styles.resendRow}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Voye ankò</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendTimer}>Voye ankò nan {countdown}s</Text>
        )}
      </View>

      <TouchableOpacity style={[styles.btnOrange, { marginTop: 20 }]} onPress={handleVerifyCode}>
        <Text style={styles.btnText}>Konfime Kòd</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.iconWrap}>
        <Ionicons name="key-outline" size={48} color={colors.accent} />
      </View>
      <Text style={styles.title}>Nouvo Modpas</Text>

      <Text style={[styles.label, { marginTop: 20 }]}>Nouvo Modpas</Text>
      <View style={[styles.inputRow, errors.newPassword && styles.inputErrorBorder]}>
        <TextInput
          style={styles.inputField}
          value={newPassword}
          onChangeText={(t) => { setNewPassword(t); setErrors((p) => ({ ...p, newPassword: null })); }}
          secureTextEntry={!showNew}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Ionicons name={showNew ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

      <Text style={[styles.label, { marginTop: 16 }]}>Konfime Modpas</Text>
      <View style={[styles.inputRow, errors.confirmPassword && styles.inputErrorBorder]}>
        <TextInput
          style={styles.inputField}
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setErrors((p) => ({ ...p, confirmPassword: null })); }}
          secureTextEntry={!showConfirm}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
        />
        {confirmPassword.length > 0 && confirmPassword === newPassword && (
          <Ionicons name="checkmark-circle" size={22} color={colors.safe} />
        )}
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <TouchableOpacity style={[styles.btnOrange, { marginTop: 24 }]} onPress={handleChangePassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Chanje Modpas</Text>}
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => {
            if (step > 1) setStep(step - 1);
            else navigation?.goBack?.();
          }}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.card}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  backBtn: { marginLeft: 20, marginTop: 12, marginBottom: 8 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
    marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  iconWrap: { alignItems: 'center', marginBottom: 16 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.primary, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 4 },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderColor: '#E2E8F0', borderRadius: 12, height: 52, paddingHorizontal: 14,
  },
  inputErrorBorder: { borderColor: colors.danger },
  inputField: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  prefix: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  vertDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0', marginHorizontal: 10 },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: 4 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24 },
  otpBox: {
    width: 56, height: 64, borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 12, fontFamily: fonts.bold, fontSize: 24, color: colors.primary,
  },
  otpBoxFilled: { backgroundColor: colors.primary, color: '#FFFFFF' },
  otpBoxActive: { borderColor: colors.accent },
  resendRow: { alignItems: 'center', marginTop: 16 },
  resendTimer: { fontFamily: fonts.regular, fontSize: 13, color: '#9CA3AF' },
  resendLink: { fontFamily: fonts.semibold, fontSize: 13, color: colors.accent },
  btnOrange: {
    backgroundColor: colors.accent, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  btnText: { fontFamily: fonts.semibold, fontSize: 16, color: '#FFFFFF' },
});
