import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import { useCamouflageStore } from '../store/appStore';
import { useAppStore } from '../store/appStore';

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [pinBuffer, setPinBuffer] = useState('');
  const { verifyPin, setActive } = useCamouflageStore();
  const setAppFlowState = useAppStore((s) => s.setAppFlowState);

  const handlePress = (btn) => {
    if (btn === 'C') {
      setDisplay('0');
      setPinBuffer('');
      return;
    }
    if (btn === '⌫') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      setPinBuffer((prev) => prev.slice(0, -1));
      return;
    }
    if (btn === '=') {
      if (verifyPin(pinBuffer)) {
        setActive(false);
        setAppFlowState('splash');
      } else {
        try {
          const result = eval(display.replace('×', '*').replace('÷', '/'));
          setDisplay(String(result));
        } catch (e) {
          setDisplay('Erè');
        }
      }
      setPinBuffer('');
      return;
    }
    if (['÷', '×', '-', '+', '%', '±'].includes(btn)) {
      setDisplay((prev) => prev + btn);
      return;
    }
    if (/[0-9]/.test(btn)) {
      setPinBuffer((prev) => prev + btn);
    }
    setDisplay((prev) => (prev === '0' ? btn : prev + btn));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.displayWrap}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.grid}>
        {BUTTONS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((btn) => {
              const isOp = ['÷', '×', '-', '+', '='].includes(btn);
              const isTop = ['C', '±', '%'].includes(btn);
              return (
                <TouchableOpacity
                  key={btn}
                  style={[
                    styles.btn,
                    isOp && styles.btnOp,
                    isTop && styles.btnTop,
                    btn === '0' && styles.btnZero,
                  ]}
                  onPress={() => handlePress(btn)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.btnText, isOp && styles.btnOpText, isTop && styles.btnTopText]}>
                    {btn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  displayWrap: {
    flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end',
    paddingHorizontal: 24, paddingBottom: 16,
  },
  displayText: { color: '#FFFFFF', fontSize: 64, fontWeight: '300' },
  grid: { paddingHorizontal: 12, paddingBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  btn: {
    width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#333333',
    justifyContent: 'center', alignItems: 'center',
  },
  btnOp: { backgroundColor: '#F97316' },
  btnTop: { backgroundColor: '#A5A5A5' },
  btnZero: { width: 75 },
  btnText: { color: '#FFFFFF', fontSize: 28, fontWeight: '500' },
  btnOpText: { color: '#FFFFFF', fontSize: 32 },
  btnTopText: { color: '#000000' },
});
