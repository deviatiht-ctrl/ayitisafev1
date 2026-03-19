import React from 'react';
import { useCamouflageStore } from '../store/appStore';
import BottomTabNavigator from './BottomTabNavigator';
import CalculatorScreen from '../screens/CalculatorScreen';

export default function RootNavigator() {
  const { isActive } = useCamouflageStore();

  // If camouflage is active, show calculator instead of main app
  if (isActive) {
    return <CalculatorScreen />;
  }

  return <BottomTabNavigator />;
}
