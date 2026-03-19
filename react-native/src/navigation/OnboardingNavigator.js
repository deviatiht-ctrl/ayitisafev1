import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator({ onComplete, onLogin, onRegister, onGuest }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding">
        {(props) => (
          <OnboardingScreen
            {...props}
            onComplete={onComplete}
            onLogin={onLogin}
            onRegister={onRegister}
            onGuest={onGuest}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
