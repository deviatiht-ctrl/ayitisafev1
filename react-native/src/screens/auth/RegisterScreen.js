import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, Image, Modal,
  SafeAreaView, StatusBar, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { colors, fonts } from '../../theme';
import SuccessModal from '../../components/auth/SuccessModal';

const DEPARTMENTS = [
  'Ouest', 'Nord', 'Sud', 'Artibonite', 'Centre',
  "Grand'Anse", 'Nord-Est', 'Nord-Ouest', 'Sud-Est', 'Nippes',
];

const RELATIONS = ['Fanmi', 'Zanmi', 'Kòlèg', 'Lòt'];

export default function RegisterScreen({ navigation, onRegisterSuccess }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showRelPicker, setShowRelPicker] = useState({ visible: false, field: '' });
  const [showTerms, setShowTerms] = useState(false);

  // Step 1
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  // Step 2
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Step 3
  const [contact1Name, setContact1Name] = useState('');
  const [contact1Phone, setContact1Phone] = useState('');
  const [contact1Relation, setContact1Relation] = useState('');
  const [contact2Name, setContact2Name] = useState('');
  const [contact2Phone, setContact2Phone] = useState('');
  const [contact2Relation, setContact2Relation] = useState('');
  const [shareLocation, setShareLocation] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '#E2E8F0' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, label: 'Fèb', color: colors.danger };
    if (score <= 2) return { level: 2, label: 'Mwayen', color: colors.warning };
    return { level: 3, label: 'Fò', color: colors.safe };
  };

  const validateStep1 = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Tanpri antre non konplè ou';
    if (!phone.trim() || phone.length < 8) e.phone = 'Nimewo telefòn sa a pa valid';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (password.length < 8) e.password = 'Modpas dwe gen omwen 8 karaktè';
    if (password !== confirmPassword) e.confirmPassword = 'Modpas yo pa menm';
    const pinStr = pin.join('');
    if (pinStr.length !== 4) e.pin = 'PIN dwe gen 4 chif';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!contact1Name.trim()) e.contact1Name = 'Tanpri antre non kontak la';
    if (!contact1Phone.trim()) e.contact1Phone = 'Nimewo telefòn sa a pa valid';
    if (!termsAccepted) e.terms = 'Tanpri aksepte kondisyon yo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;
    try {
      const pinStr = pin.join('');
      await SecureStore.setItemAsync('camouflagePin', pinStr);
      await AsyncStorage.setItem('userToken', 'mock_token_123');
      await AsyncStorage.setItem('hasLaunched', 'true');
      await AsyncStorage.removeItem('guestMode');
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        fullName, phone, department, neighborhood, email,
        contact1: { name: contact1Name, phone: contact1Phone, relation: contact1Relation },
        contact2: { name: contact2Name, phone: contact2Phone, relation: contact2Relation },
        shareLocation, avatar,
      }));
      setShowSuccess(true);
    } catch (err) {
      Alert.alert('Erè', 'Yon erè rive. Eseye ankò.');
    }
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    if (onRegisterSuccess) onRegisterSuccess();
  };

  const handlePinChange = (text, index) => {
    const newPin = [...pin];
    newPin[index] = text.replace(/[^0-9]/g, '');
    setPin(newPin);
    if (text && index < 3) pinRefs[index + 1].current?.focus();
  };

  const handlePinKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressRow}>
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <View style={styles.stepCol}>
            <View style={[
              styles.stepDot,
              step > s && { backgroundColor: colors.safe },
              step === s && { backgroundColor: colors.accent },
              step < s && { backgroundColor: '#E2E8F0' },
            ]}>
              {step > s ? (
                <Ionicons name="checkmark" size={14} color="#FFF" />
              ) : (
                <Text style={[styles.stepNum, step === s && { color: '#FFF' }]}>{s}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, step === s && { color: colors.accent }]}>
              {['Enfòmasyon', 'Sekirite', 'Kontak'][i]}
            </Text>
          </View>
          {i < 2 && (
            <View style={[styles.stepLine, step > s && { backgroundColor: colors.safe }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <>
      {/* Avatar */}
      <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} activeOpacity={0.7}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color="#9CA3AF" />
          </View>
        )}
        <View style={styles.cameraOverlay}>
          <Ionicons name="camera" size={16} color={colors.accent} />
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Non Konplè</Text>
      <TextInput
        style={[styles.input, errors.fullName && styles.inputError]}
        value={fullName}
        onChangeText={(t) => { setFullName(t); setErrors((p) => ({ ...p, fullName: null })); }}
        placeholder="Jean-Pierre Morales"
        placeholderTextColor="#9CA3AF"
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <Text style={[styles.label, { marginTop: 16 }]}>Nimewo Telefòn</Text>
      <View style={[styles.inputRow, errors.phone && styles.inputErrorBorder]}>
        <Text style={styles.prefix}>+509</Text>
        <View style={styles.vertDivider} />
        <TextInput
          style={styles.inputField}
          value={phone}
          onChangeText={(t) => { setPhone(t); setErrors((p) => ({ ...p, phone: null })); }}
          keyboardType="phone-pad"
          placeholder="XXXX-XXXX"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <Text style={[styles.label, { marginTop: 16 }]}>Depatman</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDeptPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={department ? styles.inputText : styles.placeholderText}>
          {department || 'Chwazi depatman...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: 16 }]}>Katye / Vwazinaj</Text>
      <TextInput
        style={styles.input}
        value={neighborhood}
        onChangeText={setNeighborhood}
        placeholder="Pétion-Ville, Delmas..."
        placeholderTextColor="#9CA3AF"
      />
    </>
  );

  const renderStep2 = () => {
    const strength = getPasswordStrength();
    return (
      <>
        <Text style={styles.label}>Imèl <Text style={styles.optionalLabel}>(opsyonèl)</Text></Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="imel@egzanp.com"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Modpas</Text>
        <View style={[styles.inputRow, errors.password && styles.inputErrorBorder]}>
          <TextInput
            style={styles.inputField}
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((p) => ({ ...p, password: null })); }}
            secureTextEntry={!showPass}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        {password.length > 0 && (
          <View style={styles.strengthRow}>
            {[1, 2, 3].map((lvl) => (
              <View
                key={lvl}
                style={[
                  styles.strengthBar,
                  { backgroundColor: lvl <= strength.level ? strength.color : '#E2E8F0' },
                ]}
              />
            ))}
            <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
          </View>
        )}

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
          {confirmPassword.length > 0 && confirmPassword === password && (
            <Ionicons name="checkmark-circle" size={22} color={colors.safe} />
          )}
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <Text style={[styles.label, { marginTop: 20 }]}>PIN Kamouflaj (4 chif)</Text>
        <View style={styles.pinRow}>
          {pin.map((digit, i) => (
            <TextInput
              key={i}
              ref={pinRefs[i]}
              style={[
                styles.pinBox,
                digit ? styles.pinBoxFilled : null,
                errors.pin && !digit ? styles.inputErrorBorder : null,
              ]}
              value={digit}
              onChangeText={(t) => handlePinChange(t, i)}
              onKeyPress={(e) => handlePinKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>
        <Text style={styles.pinHint}>
          <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" /> Kòd sa a pou dezaktive kamouflaj la
        </Text>
        {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}
      </>
    );
  };

  const renderStep3 = () => (
    <>
      <Text style={styles.sectionTitle}>Kontak Dijans</Text>
      <Text style={styles.sectionSub}>Moun pou avèti si ou nan danje</Text>

      <Text style={[styles.label, { marginTop: 16 }]}>Non Kontak 1</Text>
      <TextInput
        style={[styles.input, errors.contact1Name && styles.inputErrorSingle]}
        value={contact1Name}
        onChangeText={(t) => { setContact1Name(t); setErrors((p) => ({ ...p, contact1Name: null })); }}
        placeholder="Non kontak..."
        placeholderTextColor="#9CA3AF"
      />
      {errors.contact1Name && <Text style={styles.errorText}>{errors.contact1Name}</Text>}

      <Text style={[styles.label, { marginTop: 12 }]}>Nimewo Telefòn</Text>
      <TextInput
        style={[styles.input, errors.contact1Phone && styles.inputErrorSingle]}
        value={contact1Phone}
        onChangeText={(t) => { setContact1Phone(t); setErrors((p) => ({ ...p, contact1Phone: null })); }}
        keyboardType="phone-pad"
        placeholder="XXXX-XXXX"
        placeholderTextColor="#9CA3AF"
      />
      {errors.contact1Phone && <Text style={styles.errorText}>{errors.contact1Phone}</Text>}

      <Text style={[styles.label, { marginTop: 12 }]}>Relasyon</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowRelPicker({ visible: true, field: 'contact1' })}
      >
        <Text style={contact1Relation ? styles.inputText : styles.placeholderText}>
          {contact1Relation || 'Chwazi relasyon...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.label}>Non Kontak 2 <Text style={styles.optionalLabel}>(opsyonèl)</Text></Text>
      <TextInput
        style={styles.input}
        value={contact2Name}
        onChangeText={setContact2Name}
        placeholder="Non kontak..."
        placeholderTextColor="#9CA3AF"
      />

      <Text style={[styles.label, { marginTop: 12 }]}>Nimewo Telefòn</Text>
      <TextInput
        style={styles.input}
        value={contact2Phone}
        onChangeText={setContact2Phone}
        keyboardType="phone-pad"
        placeholder="XXXX-XXXX"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={[styles.label, { marginTop: 12 }]}>Relasyon</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowRelPicker({ visible: true, field: 'contact2' })}
      >
        <Text style={contact2Relation ? styles.inputText : styles.placeholderText}>
          {contact2Relation || 'Chwazi relasyon...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Share location */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Pataje pozisyon mwen ak kontak dijans</Text>
        <Switch
          value={shareLocation}
          onValueChange={setShareLocation}
          trackColor={{ false: '#E2E8F0', true: colors.accent }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Terms */}
      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setTermsAccepted(!termsAccepted)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
          {termsAccepted && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </View>
        <Text style={styles.checkLabel}>
          Mwen dakò ak{' '}
          <Text style={styles.checkLink} onPress={() => setShowTerms(true)}>
            Kondisyon Itilizasyon yo
          </Text>
        </Text>
      </TouchableOpacity>
      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => {
                if (step > 1) setStep(step - 1);
                else navigation?.goBack?.();
              }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <Image source={require('../../../assets/LOGO.jpg')} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.logoText}>AyitiSafe</Text>
            </View>
            <View style={{ width: 24 }} />
          </View>

          {renderProgressBar()}

          <View style={styles.card}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Button */}
            {step < 3 ? (
              <TouchableOpacity style={[styles.btnOrange, { marginTop: 24 }]} onPress={handleNext} activeOpacity={0.8}>
                <Text style={styles.btnOrangeText}>Kontinye →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.btnOrange, { marginTop: 24 }, !termsAccepted && { backgroundColor: '#CBD5E1' }]}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={!termsAccepted}
              >
                <Text style={styles.btnOrangeText}>Kreye Kont Mwen</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Department Picker Modal */}
      <Modal visible={showDeptPicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDeptPicker(false)}>
          <View style={styles.pickerCard}>
            <View style={styles.dragHandle} />
            <Text style={styles.pickerTitle}>Chwazi Depatman</Text>
            {DEPARTMENTS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.pickerItem, department === d && styles.pickerItemActive]}
                onPress={() => { setDepartment(d); setShowDeptPicker(false); }}
              >
                <Text style={[styles.pickerItemText, department === d && { color: colors.accent }]}>{d}</Text>
                {department === d && <Ionicons name="checkmark" size={20} color={colors.accent} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Relation Picker Modal */}
      <Modal visible={showRelPicker.visible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRelPicker({ visible: false, field: '' })}>
          <View style={styles.pickerCard}>
            <View style={styles.dragHandle} />
            <Text style={styles.pickerTitle}>Chwazi Relasyon</Text>
            {RELATIONS.map((r) => {
              const current = showRelPicker.field === 'contact1' ? contact1Relation : contact2Relation;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.pickerItem, current === r && styles.pickerItemActive]}
                  onPress={() => {
                    if (showRelPicker.field === 'contact1') setContact1Relation(r);
                    else setContact2Relation(r);
                    setShowRelPicker({ visible: false, field: '' });
                  }}
                >
                  <Text style={[styles.pickerItemText, current === r && { color: colors.accent }]}>{r}</Text>
                  {current === r && <Ionicons name="checkmark" size={20} color={colors.accent} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Terms Modal */}
      <Modal visible={showTerms} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerCard, { maxHeight: '80%' }]}>
            <View style={styles.dragHandle} />
            <Text style={styles.pickerTitle}>Kondisyon Itilizasyon</Text>
            <ScrollView style={{ marginTop: 12 }}>
              <Text style={styles.termsText}>
                Byenveni nan AyitiSafe. Lè ou itilize aplikasyon sa a, ou dakò ak kondisyon sa yo:{'\n\n'}
                1. Pwoteksyon Done: Nou respekte vi prive ou. Enfòmasyon pèsonèl ou yo pwoteje epi nou pa pataje yo ak pèsonn san konsantman ou.{'\n\n'}
                2. Itilizasyon App la: Ou aksepte itilize app la pou rezon legal sèlman. Fo rapò ka mennen nan sispansyon kont ou.{'\n\n'}
                3. Anonimite: Rapò ensidan yo rete anonim. Okenn lòt itilizatè pa ka wè ki moun ki fè rapò a.{'\n\n'}
                4. Lokalizasyon: Nou itilize pozisyon ou sèlman pou bay alèt sekirite ki enpòtan pou ou. Ou ka dezaktive sa nenpòt lè.{'\n\n'}
                5. Kontak Dijans: Enfòmasyon kontak dijans ou yo estoke an sekirite epi yo itilize sèlman lè ou aktive fonksyon dijans lan.{'\n\n'}
                6. Mòd Kamouflaj: Fonksyon sa a fèt pou pwoteje ou nan sitiyasyon danjere. Itilize li ak responsablite.{'\n\n'}
                Pa itilize AyitiSafe, ou rekonèt ou te li epi ou dakò ak tout kondisyon sa yo.
              </Text>
            </ScrollView>
            <TouchableOpacity style={[styles.btnOrange, { marginTop: 16 }]} onPress={() => setShowTerms(false)}>
              <Text style={styles.btnOrangeText}>Fèmen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        name={fullName}
        onDismiss={handleSuccessDismiss}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 12,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoImg: { width: 36, height: 36, borderRadius: 18 },
  logoText: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },
  progressRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, paddingVertical: 20,
  },
  stepCol: { alignItems: 'center' },
  stepDot: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0',
    justifyContent: 'center', alignItems: 'center',
  },
  stepNum: { fontFamily: fonts.semibold, fontSize: 12, color: '#9CA3AF' },
  stepLabel: { fontFamily: fonts.medium, fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 4, marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24,
    marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  avatarWrap: { alignSelf: 'center', marginBottom: 20 },
  avatarImg: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#E2E8F0',
    justifyContent: 'center', alignItems: 'center',
  },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
    borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: '#F4F6F9',
  },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginBottom: 6 },
  optionalLabel: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF' },
  input: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
    height: 52, paddingHorizontal: 14, fontFamily: fonts.regular,
    fontSize: 15, color: colors.primary,
  },
  inputError: { borderColor: colors.danger },
  inputErrorBorder: { borderColor: colors.danger },
  inputErrorSingle: { borderColor: colors.danger },
  inputText: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  placeholderText: { fontFamily: fonts.regular, fontSize: 15, color: '#9CA3AF' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderColor: '#E2E8F0', borderRadius: 12, height: 52, paddingHorizontal: 14,
  },
  inputField: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  prefix: { fontFamily: fonts.medium, fontSize: 15, color: colors.primary },
  vertDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0', marginHorizontal: 10 },
  errorText: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: 4 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontFamily: fonts.medium, fontSize: 11, marginLeft: 6 },
  pinRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 8 },
  pinBox: {
    width: 56, height: 64, borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 12, fontFamily: fonts.bold, fontSize: 24, color: colors.primary,
    textAlign: 'center',
  },
  pinBoxFilled: { backgroundColor: colors.primary, color: '#FFFFFF' },
  pinHint: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF', marginTop: 8, textAlign: 'center' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.primary },
  sectionSub: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4 },
  separator: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 20 },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 20, paddingVertical: 8,
  },
  toggleLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.primary, flex: 1, marginRight: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 10 },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2,
    borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkLabel: { fontFamily: fonts.regular, fontSize: 13, color: '#64748B', flex: 1 },
  checkLink: { color: colors.accent, textDecorationLine: 'underline' },
  btnOrange: {
    backgroundColor: colors.accent, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  btnOrangeText: { fontFamily: fonts.semibold, fontSize: 16, color: '#FFFFFF' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  dragHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0',
    alignSelf: 'center', marginBottom: 16,
  },
  pickerTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary, marginBottom: 8 },
  pickerItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F4F6F9',
  },
  pickerItemActive: { backgroundColor: '#FFF7ED' },
  pickerItemText: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary },
  termsText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', lineHeight: 22 },
});
