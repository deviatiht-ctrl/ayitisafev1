import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import GuestMapScreen from '../screens/guest/GuestMapScreen';
import GuestAlertsScreen from '../screens/guest/GuestAlertsScreen';
import GuestLockedScreen from '../screens/guest/GuestLockedScreen';
import GuestSettingsScreen from '../screens/guest/GuestSettingsScreen';
import LockedFeatureModal from '../components/LockedFeatureModal';

const Tab = createBottomTabNavigator();

function LockedTabButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.centerButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.centerButtonInner}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function GuestNavigator() {
  const [lockedVisible, setLockedVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="GuestMap"
          component={GuestMapScreen}
          options={{
            tabBarLabel: 'Kat',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="GuestAlerts"
          component={GuestAlertsScreen}
          options={{
            tabBarLabel: 'Alèt',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="notifications" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="GuestReport"
          component={GuestLockedScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <View>
                <Ionicons name="add" size={28} color="#FFFFFF" />
                <View style={styles.lockOverlay}>
                  <Ionicons name="lock-closed" size={10} color="#FFF" />
                </View>
              </View>
            ),
            tabBarButton: (props) => (
              <LockedTabButton {...props} onPress={() => setLockedVisible(true)} />
            ),
          }}
        />
        <Tab.Screen
          name="GuestProfile"
          component={GuestLockedScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setLockedVisible(true);
            },
          }}
          options={{
            tabBarLabel: 'Pwofil',
            tabBarIcon: ({ color, size }) => (
              <View>
                <Ionicons name="person" size={size} color={color} />
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={8} color="#FFF" />
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="GuestSettings"
          component={GuestSettingsScreen}
          options={{
            tabBarLabel: 'Paramèt',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <LockedFeatureModal
        visible={lockedVisible}
        onClose={() => setLockedVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    marginTop: 2,
  },
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
