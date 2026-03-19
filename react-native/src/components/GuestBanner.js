import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/appStore';
import { fonts } from '../theme';

export default function GuestBanner() {
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);

  return (
    <LinearGradient colors={['#1B2A4A', '#243452']} style={styles.container}>
      <View style={styles.left}>
        <Ionicons name="eye-outline" size={18} color="#FFFFFF" />
        <Text style={styles.label}>Mòd Envite — Aksè Limite</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setAppFlowState('auth')}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Kreye Kont</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  btn: {
    backgroundColor: '#F97316',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  btnText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: '#FFFFFF',
  },
});
