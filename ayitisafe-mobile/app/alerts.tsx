import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { RefreshCw, Clock } from 'lucide-react-native';
import { BottomNav } from '../components/bottom-nav';
import { FilterChips } from '../components/filter-chips';
import { AlertCard } from '../components/alert-card';
import { alerts } from '../lib/mock-data';
import type { Alert } from '../lib/mock-data';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const filterChips = [
    { id: 'all', label: 'Tout' },
    { id: 'critical', label: 'Kritik', color: '#EF4444' },
    { id: 'warning', label: 'Atansyon', color: '#F97316' },
    { id: 'nearby', label: 'Pre m' },
    { id: 'resolved', label: 'Rezoud', color: '#22C55E' },
];

export default function AlertsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => {
            setLastUpdated(new Date());
            setIsRefreshing(false);
        }, 1000);
    }, []);

    const filteredAlerts = alerts.filter((alert: Alert) => {
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

    const handleViewOnMap = (alert: Alert) => {
        router.replace('/' as any);
    };

    const handleShare = async (alert: Alert) => {
        try {
            await Share.share({
                message: `AyitiSafe Alèt: ${alert.title} - ${alert.location}`,
            });
        } catch (error) {
            console.log('Error sharing', error);
        }
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View
                className="bg-background/80 border-b border-border z-40"
                style={{ paddingTop: Math.max(insets.top, 16) }}
            >
                <View className="px-4 py-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-foreground">Sant Alèt</Text>
                        <Pressable
                            onPress={handleRefresh}
                            disabled={isRefreshing}
                            className="flex-row items-center gap-2"
                        >
                            <RefreshCw size={16} color="hsl(var(--muted-foreground))" />
                            <Text className="text-sm text-muted-foreground">Aktyalize</Text>
                        </Pressable>
                    </View>

                    <View className="flex-row items-center gap-2 mb-4">
                        <Clock size={12} color="hsl(var(--muted-foreground))" />
                        <Text className="text-xs text-muted-foreground">
                            Dènye aktyalizasyon: {lastUpdated.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>

                    <FilterChips
                        chips={filterChips}
                        activeChip={activeFilter}
                        onSelect={setActiveFilter}
                        className="-mx-4"
                    />
                </View>
            </View>

            {/* Alert List */}
            <ScrollView
                className="flex-1 px-4 pt-4"
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                {filteredAlerts.length === 0 ? (
                    <View className="items-center py-12">
                        <Text className="text-muted-foreground">Pa gen alèt nan kategori sa a</Text>
                    </View>
                ) : (
                    filteredAlerts.map((alert) => (
                        <AlertCard
                            key={alert.id}
                            alert={alert}
                            onViewOnMap={() => handleViewOnMap(alert)}
                            onShare={() => handleShare(alert)}
                        />
                    ))
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav />
        </View>
    );
}
