import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, borderRadius } from '../theme';
import { alerts } from '../data/mockData';
import AlertCard from '../components/AlertCard';
import FilterChips from '../components/FilterChips';

const filterChips = [
  { id: 'all', label: 'Tout' },
  { id: 'critical', label: 'Kritik', color: colors.danger },
  { id: 'warning', label: 'Atansyon', color: colors.warning },
  { id: 'nearby', label: 'Pre m' },
  { id: 'resolved', label: 'Rezoud', color: colors.safe },
];

export default function AlertsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated] = useState(new Date());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    switch (activeFilter) {
      case 'critical':
        return alert.severity === 'critical';
      case 'warning':
        return alert.severity === 'warning';
      case 'resolved':
        return alert.resolved;
      case 'nearby':
        return ['Delmas 18', 'Delmas 33'].includes(alert.location);
      default:
        return true;
    }
  });

  const handleViewOnMap = (alert) => {
    navigation.navigate('Map', { focusLocation: alert.location });
  };

  const handleShare = (alert) => {
    // Implement share functionality
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Sant Alèt</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons 
              name="refresh" 
              size={20} 
              color={colors.textLight} 
              style={refreshing ? styles.spinning : null}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.lastUpdated}>
          <Ionicons name="time-outline" size={14} color={colors.textLight} />
          <Text style={styles.lastUpdatedText}>
            Dènye aktyalizasyon: {lastUpdated.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <FilterChips
          chips={filterChips}
          activeFilter={activeFilter}
          onSelect={setActiveFilter}
        />
      </View>

      {/* Alert List */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item, index }) => (
          <AlertCard
            alert={item}
            onViewOnMap={() => handleViewOnMap(item)}
            onShare={() => handleShare(item)}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Pa gen alèt nan kategori sa a</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  refreshButton: {
    padding: spacing.sm,
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  lastUpdatedText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
});
