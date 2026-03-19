import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Alert, Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

// Modern Gradient Icon Component using MaterialCommunityIcons (Lucide-style)
const IncidentIcon = ({ icon, gradientColors, isSelected }) => (
  <LinearGradient
    colors={isSelected ? gradientColors : [`${gradientColors[0]}18`, `${gradientColors[1]}18`]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={iconStyles.container}
  >
    <MaterialCommunityIcons 
      name={icon} 
      size={26} 
      color={isSelected ? '#FFFFFF' : gradientColors[0]} 
    />
  </LinearGradient>
);

const iconStyles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default function ReportScreen() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(null);
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('error'), t('photoPermission'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5,
    });

    if (!result.canceled && result.assets) {
      setPhotos([...photos, ...result.assets.map(a => a.uri)].slice(0, 5));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('error'), t('cameraPermission'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setPhotos([...photos, result.assets[0].uri].slice(0, 5));
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const INCIDENT_TYPES = [
    { key: 'shooting', icon: 'pistol', label: t('shooting'), gradient: ['#EF4444', '#DC2626'] },
    { key: 'barricade', icon: 'barrier', label: t('barricade'), gradient: ['#F59E0B', '#D97706'] },
    { key: 'accident', icon: 'car-crash', label: t('accident'), gradient: ['#3B82F6', '#2563EB'] },
    { key: 'theft', icon: 'bag-personal-off', label: t('theft'), gradient: ['#8B5CF6', '#7C3AED'] },
    { key: 'flood', icon: 'home-flood', label: t('flood'), gradient: ['#06B6D4', '#0891B2'] },
    { key: 'other', icon: 'dots-horizontal-circle-outline', label: t('other'), gradient: ['#6B7280', '#4B5563'] },
  ];

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert(t('error'), t('selectIncidentType'));
      return;
    }
    
    // Save report to local storage
    try {
      const existingReports = await AsyncStorage.getItem('userReports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push({
        type: selectedType,
        description,
        severity: severity || 'medium',
        status: 'pending',
        date: new Date().toLocaleDateString(),
        location: 'Pozisyon aktyèl',
        photos: photos,
      });
      await AsyncStorage.setItem('userReports', JSON.stringify(reports));
      
      // Update user stats
      const statsData = await AsyncStorage.getItem('userStats');
      const stats = statsData ? JSON.parse(statsData) : { reportsSubmitted: 0, alertsViewed: 0, daysActive: 1 };
      stats.reportsSubmitted += 1;
      await AsyncStorage.setItem('userStats', JSON.stringify(stats));
    } catch (e) {
      console.log(e);
    }
    
    Alert.alert(t('thanks'), t('reportSuccess'), [
      { text: t('ok'), onPress: () => { setSelectedType(null); setDescription(''); setSeverity(null); setPhotos([]); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('reportIncident')}</Text>
        <Text style={styles.subtitle}>{t('helpCommunity')}</Text>

        <Text style={styles.sectionLabel}>{t('incidentType')}</Text>
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.typeCard, 
                selectedType === type.key && styles.typeCardSelected,
                selectedType === type.key && { borderColor: type.gradient[0] }
              ]}
              onPress={() => setSelectedType(type.key)}
              activeOpacity={0.7}
            >
              <IncidentIcon 
                icon={type.icon} 
                gradientColors={type.gradient} 
                isSelected={selectedType === type.key}
              />
              <Text style={[
                styles.typeLabel,
                selectedType === type.key && { color: type.gradient[0], fontFamily: fonts.semiBold }
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('severityLevel')}</Text>
        <View style={styles.severityRow}>
          {[
            { key: 'low', label: t('low'), color: colors.safe },
            { key: 'medium', label: t('medium'), color: colors.warning },
            { key: 'high', label: t('high'), color: colors.danger },
          ].map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.severityBtn, severity === s.key && { backgroundColor: s.color }]}
              onPress={() => setSeverity(s.key)}
            >
              <Text style={[styles.severityText, severity === s.key && { color: '#FFF' }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('description')}</Text>
        <TextInput
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          placeholder={t('descriptionPlaceholder')}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Photo Upload Section */}
        <Text style={styles.sectionLabel}>{t('addPhotos')}</Text>
        <View style={styles.photoSection}>
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={colors.accent} />
              <Text style={styles.photoBtnText}>{t('takePhoto')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
              <Ionicons name="images" size={24} color={colors.accent} />
              <Text style={styles.photoBtnText}>{t('chooseGallery')}</Text>
            </TouchableOpacity>
          </View>
          
          {photos.length > 0 && (
            <View style={styles.photoPreviewRow}>
              {photos.map((uri, index) => (
                <View key={index} style={styles.photoPreview}>
                  <Image source={{ uri }} style={styles.photoImage} />
                  <TouchableOpacity 
                    style={styles.photoRemove} 
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={22} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <Text style={styles.photoHint}>{t('maxPhotos')}</Text>
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} activeOpacity={0.8}>
          <Ionicons name="send" size={18} color="#FFF" />
          <Text style={styles.btnSubmitText}>{t('sendReport')}</Text>
        </TouchableOpacity>

        <View style={styles.anonBadge}>
          <Ionicons name="eye-off" size={14} color="#9CA3AF" />
          <Text style={styles.anonText}>{t('reportAnonymous')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.bold, fontSize: 28, color: colors.primary },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 20 },
  sectionLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, marginBottom: 10, marginTop: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeCard: {
    width: '30%', backgroundColor: '#FFF', borderRadius: 18, paddingVertical: 16, paddingHorizontal: 8,
    alignItems: 'center', borderWidth: 2, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  typeCardSelected: {
    backgroundColor: '#FAFAFA', borderWidth: 2,
    shadowOpacity: 0.08, elevation: 4,
  },
  typeLabel: { fontFamily: fonts.medium, fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4 },
  severityRow: { flexDirection: 'row', gap: 10 },
  severityBtn: {
    flex: 1, height: 44, borderRadius: 10, backgroundColor: '#F4F6F9',
    justifyContent: 'center', alignItems: 'center',
  },
  severityText: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B' },
  textarea: {
    backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0',
    padding: 14, fontFamily: fonts.regular, fontSize: 14, color: colors.primary,
    minHeight: 100,
  },
  btnSubmit: {
    backgroundColor: colors.accent, height: 52, borderRadius: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 20,
  },
  btnSubmitText: { fontFamily: fonts.semibold, fontSize: 16, color: '#FFF' },
  anonBadge: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 6, marginTop: 12,
  },
  anonText: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF' },
  photoSection: { marginTop: 8 },
  photoButtons: { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#FFF', borderRadius: 12, paddingVertical: 14,
    borderWidth: 1.5, borderColor: colors.accent, borderStyle: 'dashed',
  },
  photoBtnText: { fontFamily: fonts.medium, fontSize: 13, color: colors.accent },
  photoPreviewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  photoPreview: { position: 'relative' },
  photoImage: { width: 70, height: 70, borderRadius: 10 },
  photoRemove: { position: 'absolute', top: -8, right: -8, backgroundColor: '#FFF', borderRadius: 12 },
  photoHint: { fontFamily: fonts.regular, fontSize: 11, color: '#9CA3AF', marginTop: 8 },
});
