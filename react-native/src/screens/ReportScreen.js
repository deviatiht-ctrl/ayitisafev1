import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

const INCIDENT_TYPES = [
  { key: 'shooting', icon: 'flame', label: 'Tire / Zam', color: '#EF4444' },
  { key: 'barricade', icon: 'warning', label: 'Barikad', color: '#F59E0B' },
  { key: 'accident', icon: 'car', label: 'Aksidan', color: '#3B82F6' },
  { key: 'theft', icon: 'hand-left', label: 'Vòl', color: '#8B5CF6' },
  { key: 'flood', icon: 'water', label: 'Inondasyon', color: '#06B6D4' },
  { key: 'other', icon: 'alert-circle', label: 'Lòt', color: '#6B7280' },
];

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(null);

  const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Erè', 'Tanpri chwazi yon tip ensidan');
      return;
    }
    Alert.alert('Mèsi! 🎉', 'Rapò ou a voye avèk siksè. Li ap ede pwoteje kominote a.', [
      { text: 'OK', onPress: () => { setSelectedType(null); setDescription(''); setSeverity(null); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Rapòte Ensidan</Text>
        <Text style={styles.subtitle}>Ede kominote a rete an sekirite</Text>

        <Text style={styles.sectionLabel}>Tip Ensidan</Text>
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeCard, selectedType === t.key && { borderColor: t.color, borderWidth: 2 }]}
              onPress={() => setSelectedType(t.key)}
              activeOpacity={0.7}
            >
              <Ionicons name={t.icon} size={24} color={t.color} />
              <Text style={styles.typeLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Nivo Gravite</Text>
        <View style={styles.severityRow}>
          {[
            { key: 'low', label: 'Ba', color: colors.safe },
            { key: 'medium', label: 'Mwayen', color: colors.warning },
            { key: 'high', label: 'Wo', color: colors.danger },
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

        <Text style={styles.sectionLabel}>Deskripsyon</Text>
        <TextInput
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          placeholder="Dekri sa k pase a..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} activeOpacity={0.8}>
          <Ionicons name="send" size={18} color="#FFF" />
          <Text style={styles.btnSubmitText}>Voye Rapò</Text>
        </TouchableOpacity>

        <View style={styles.anonBadge}>
          <Ionicons name="eye-off" size={14} color="#9CA3AF" />
          <Text style={styles.anonText}>Rapò sa a 100% anonim</Text>
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: {
    width: '31%', backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  typeLabel: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary, textAlign: 'center' },
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
});
