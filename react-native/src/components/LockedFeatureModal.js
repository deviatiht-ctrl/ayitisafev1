import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { colors, fonts } from '../theme';

const FEATURES = [
  'Rapòte ensidan',
  'Resevwa alèt pèsonalize',
  'Wout sekirite pèsonèl',
  'Kontak dijans',
  'Nivo sekirite ou',
];

export default function LockedFeatureModal({ visible, onClose }) {
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);

  const handleRegister = () => {
    onClose();
    setAppFlowState('auth');
  };

  const handleLogin = () => {
    onClose();
    setAppFlowState('auth');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.dragHandle} />

          <View style={styles.lockCircle}>
            <Ionicons name="lock-closed" size={56} color={colors.primary} />
          </View>

          <Text style={styles.title}>Fonksyon Rezève</Text>
          <Text style={styles.body}>
            Fonksyon sa a disponib sèlman pou manm ki gen kont. Kreye yon kont gratis pou jwi tout benefis AyitiSafe.
          </Text>

          <View style={styles.featureList}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color={colors.safe} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.btnOrange} onPress={handleRegister} activeOpacity={0.8}>
            <Text style={styles.btnOrangeText}>Kreye Kont Gratis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnOutline} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.btnOutlineText}>Konekte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestWrap} onPress={onClose}>
            <Text style={styles.guestText}>Kontinye kòm Envite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 20,
  },
  lockCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    marginBottom: 8,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  featureList: {
    width: '100%',
    marginBottom: 24,
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.primary,
  },
  btnOrange: {
    backgroundColor: colors.accent,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  btnOrangeText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  btnOutline: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  btnOutlineText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.primary,
  },
  guestWrap: {
    marginTop: 4,
  },
  guestText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
});
