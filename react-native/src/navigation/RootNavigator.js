import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/appStore';
import { useCamouflageStore } from '../store/appStore';
import { useLanguageStore } from '../store/languageStore';
import SplashScreen from '../screens/auth/SplashScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import GuestNavigator from './GuestNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import CalculatorScreen from '../screens/CalculatorScreen';

export default function RootNavigator() {
  const appState = useAppStore((s) => s.appFlowState);
  const setAppState = useAppStore((s) => s.setAppFlowState);
  const { isActive: camouflageActive } = useCamouflageStore();
  const { hasSelectedLanguage } = useLanguageStore();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (camouflageActive) {
          setAppState('calculator');
          return;
        }
        
        // Check if language has been selected
        if (!hasSelectedLanguage) {
          setAppState('language');
          return;
        }
        
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const userToken = await AsyncStorage.getItem('userToken');
        const isGuest = await AsyncStorage.getItem('guestMode');

        if (!hasLaunched) {
          setAppState('onboarding');
        } else if (isGuest === 'true') {
          setAppState('guest');
        } else if (!userToken) {
          setAppState('auth');
        } else {
          setAppState('app');
        }
      } catch (e) {
        setAppState('language');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasSelectedLanguage]);

  if (appState === 'splash') {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (appState === 'language') {
    return (
      <LanguageSelectionScreen
        onComplete={() => setAppState('onboarding')}
      />
    );
  }

  if (appState === 'onboarding') {
    return (
      <OnboardingNavigator
        onComplete={() => setAppState('auth')}
        onLogin={() => setAppState('auth')}
        onRegister={() => setAppState('auth')}
        onGuest={() => setAppState('guest')}
      />
    );
  }

  if (appState === 'auth') {
    return (
      <AuthNavigator
        onLoginSuccess={() => setAppState('app')}
        onRegisterSuccess={() => setAppState('app')}
        onGuest={() => setAppState('guest')}
      />
    );
  }

  if (appState === 'guest') {
    return <GuestNavigator />;
  }

  if (appState === 'calculator') {
    return <CalculatorScreen />;
  }

  return <BottomTabNavigator />;
}
