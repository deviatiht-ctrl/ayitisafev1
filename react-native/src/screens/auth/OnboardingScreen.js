import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts } from '../../theme';
import OnboardingSlide from '../../components/auth/OnboardingSlide';
import IllustrationMap from '../../components/auth/IllustrationMap';
import IllustrationAlert from '../../components/auth/IllustrationAlert';
import IllustrationShield from '../../components/auth/IllustrationShield';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    bg: colors.background,
    titleColor: '#1B2A4A',
    bodyColor: '#64748B',
    illustration: <IllustrationMap />,
    title: 'Konnen Zòn Ou',
    body: 'Wè an tan reyèl ki zòn ki danjere epi ki zòn ki sekirize nan Ayiti grasa entèlijans atifisyèl nou an.',
  },
  {
    id: '2',
    bg: colors.background,
    titleColor: '#1B2A4A',
    bodyColor: '#64748B',
    illustration: <IllustrationAlert />,
    title: 'Resevwa Alèt Imedyat',
    body: 'IA nou an avèti ou otomatikman lè gen tire, barikad, oswa aksidan nan wout ou pral pran an.',
    chips: ['⚡ Tan Reyèl', '🤖 IA', '📍 Pre Ou'],
  },
  {
    id: '3',
    bg: colors.primary,
    titleColor: '#FFFFFF',
    bodyColor: '#CBD5E1',
    illustration: <IllustrationShield />,
    title: 'Rapòte, Pwoteje, Sove Lavi',
    body: 'Rapòte ensidan anonimman. Pataje alèt ak fanmi w. Aktive mòd kamouflaj si ou nan danje.',
  },
];

export default function OnboardingScreen({ onComplete, onLogin, onRegister, onGuest }) {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
  };

  const handleSkip = async () => {
    await finishOnboarding();
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleRegister = async () => {
    await finishOnboarding();
    if (onRegister) onRegister();
  };

  const handleLogin = async () => {
    await finishOnboarding();
    if (onLogin) onLogin();
  };

  const handleGuest = async () => {
    await finishOnboarding();
    await AsyncStorage.setItem('guestMode', 'true');
    if (onGuest) onGuest();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item, index }) => {
    const isLast = index === SLIDES.length - 1;

    return (
      <View style={[styles.slideContainer, { backgroundColor: item.bg }]}>
        <OnboardingSlide
          illustration={item.illustration}
          title={item.title}
          body={item.body}
          titleColor={item.titleColor}
          bodyColor={item.bodyColor}
        >
          {item.chips && (
            <View style={styles.chipsRow}>
              {item.chips.map((chip, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{chip}</Text>
                </View>
              ))}
            </View>
          )}

          {isLast && (
            <View style={styles.badgeWrap}>
              <View style={styles.orangeBadge}>
                <Text style={styles.orangeBadgeText}>✓ 100% Anonimman</Text>
              </View>
            </View>
          )}
        </OnboardingSlide>

        {!isLast && (
          <View style={styles.bottomSingle}>
            <TouchableOpacity style={styles.btnOrange} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.btnOrangeText}>Pwochen →</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLast && (
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.btnOrange} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.btnOrangeText}>Kreye Kont Mwen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.btnOutlineText}>Mwen gen yon kont</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGuest} activeOpacity={0.7}>
              <Text style={styles.guestLink}>Kontinye kòm Envite</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const bgColor = currentIndex === 2 ? colors.primary : colors.background;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={currentIndex === 2 ? 'light-content' : 'dark-content'} />

      {/* Top bar */}
      <View style={styles.topBar}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={24} color={currentIndex === 2 ? '#FFFFFF' : '#1B2A4A'} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: currentIndex === 2 ? '#FFFFFF' : '#64748B' }]}>Pase</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ['#CBD5E1', '#F97316', '#CBD5E1'],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: dotColor,
                },
              ]}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    zIndex: 10,
  },
  skipText: {
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  slideContainer: {
    width,
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#1B2A4A',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#FFFFFF',
  },
  badgeWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  orangeBadge: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  orangeBadgeText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#FFFFFF',
  },
  bottomSingle: {
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  bottomButtons: {
    paddingHorizontal: 32,
    paddingBottom: 100,
    gap: 12,
    alignItems: 'center',
  },
  btnOrange: {
    backgroundColor: colors.accent,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  btnOutlineText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  guestLink: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.accent,
    marginTop: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
