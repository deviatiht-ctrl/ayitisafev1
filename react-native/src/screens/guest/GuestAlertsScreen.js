import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import AlertsScreen from '../AlertsScreen';
import GuestBanner from '../../components/GuestBanner';
import LockedFeatureModal from '../../components/LockedFeatureModal';

export default function GuestAlertsScreen() {
  const [lockedVisible, setLockedVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GuestBanner />
      <View style={styles.content}>
        <AlertsScreen
          guestMode
          onLockedAction={() => setLockedVisible(true)}
        />
      </View>
      <LockedFeatureModal
        visible={lockedVisible}
        onClose={() => setLockedVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  content: { flex: 1 },
});
