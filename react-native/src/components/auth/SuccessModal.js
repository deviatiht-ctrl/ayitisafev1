import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, Animated, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../../theme';

export default function SuccessModal({ visible, name, onDismiss }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      scale.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </Animated.View>

          <Text style={styles.title}>Byenveni nan AyitiSafe! 🎉</Text>
          <Text style={styles.subtitle}>Kont ou kreye avèk siksè.</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              💡 Konsèy: Toujou verifye zòn avan ou vwayaje nan Port-au-Prince ak nan lòt vil yo.
            </Text>
          </View>

          <TouchableOpacity style={styles.btnOrange} onPress={onDismiss} activeOpacity={0.8}>
            <Text style={styles.btnText}>Kòmanse Itilize App la</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.safe,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#FFF7ED',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
    width: '100%',
  },
  tipText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
  btnOrange: {
    backgroundColor: colors.accent,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  btnText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
