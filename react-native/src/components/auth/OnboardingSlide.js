import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { fonts } from '../../theme';

const { width } = Dimensions.get('window');

export default function OnboardingSlide({ illustration, title, body, titleColor = '#1B2A4A', bodyColor = '#64748B', children }) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.illustrationWrap}>
        {illustration}
      </View>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.body, { color: bodyColor }]}>{body}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationWrap: {
    marginBottom: 40,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
});
