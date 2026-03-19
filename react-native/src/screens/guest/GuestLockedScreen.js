import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LockedFeatureModal from '../../components/LockedFeatureModal';

export default function GuestLockedScreen() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      <LockedFeatureModal
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
});
