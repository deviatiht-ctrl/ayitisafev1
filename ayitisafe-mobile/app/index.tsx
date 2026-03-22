import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { Search, Bell, Plus, Minus, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNav } from '../components/bottom-nav';
import { LiveAlertBanner } from '../components/live-alert-banner';
import { ZoneInfoCard } from '../components/zone-info-card';
import { FilterChips } from '../components/filter-chips';
import { InteractiveMap } from '../components/InteractiveMap';
import { useAppStore } from '../lib/store';
import type { Zone } from '../lib/mock-data';

const filterChips = [
    { id: 'all', label: 'Tout' },
    { id: 'danger', label: 'Danje', color: '#EF4444' },
    { id: 'safe', label: 'Sekirite', color: '#22C55E' },
    { id: 'routes', label: 'Wout' },
];

export default function MapScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { activeFilter, setActiveFilter, showAlertBanner, setShowAlertBanner } = useAppStore();

    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [showRoute, setShowRoute] = useState(false);
    const [alertMessage] = useState('Alèt — Tire tande nan Delmas 18');

    useEffect(() => {
        if (!showAlertBanner) {
            const timer = setTimeout(() => {
                setShowAlertBanner(true);
            }, 30000);
            return () => clearTimeout(timer);
        }
    }, [showAlertBanner, setShowAlertBanner]);

    const handleZoneSelect = (zone: Zone) => {
        setSelectedZone(zone);
        setShowRoute(false);
    };

    const handleViewRoute = () => {
        setShowRoute(true);
        setSelectedZone(null);
    };

    const handleReport = () => {
        // Only route if component exists
        router.push('/report' as any);
    };

    return (
        <View className="flex-1 bg-background">
            {/* Live Alert Banner */}
            {showAlertBanner && (
                <LiveAlertBanner
                    message={alertMessage}
                    severity="critical"
                    onDismiss={() => setShowAlertBanner(false)}
                />
            )}

            {/* Map */}
            <View className="absolute inset-0">
                <InteractiveMap
                    onZoneSelect={handleZoneSelect}
                    selectedZone={selectedZone}
                    showRoute={showRoute}
                    activeFilter={activeFilter}
                />
            </View>

            {/* Top Bar */}
            <View
                className="absolute left-4 right-4 z-40 flex-row items-center gap-2"
                style={{ top: insets.top > 0 ? insets.top + 16 : 40 }}
            >
                <View className="rounded-xl overflow-hidden shadow-lg">
                    <BlurView intensity={80} tint="dark" className="p-2 justify-center items-center">
                        <Text className="text-white font-bold text-lg">AyitiSafe</Text>
                    </BlurView>
                </View>

                <View className="flex-1 relative justify-center rounded-full overflow-hidden shadow-lg">
                    <BlurView intensity={80} tint="dark" className="absolute inset-0" />
                    <View className="flex-row items-center px-4 py-2.5">
                        <Search size={16} color="hsl(var(--muted-foreground))" className="mr-2" />
                        <TextInput
                            placeholder="Trouve yon wout san danje..."
                            placeholderTextColor="hsl(var(--muted-foreground))"
                            className="flex-1 text-sm text-white p-0 m-0"
                        />
                    </View>
                </View>

                <View className="rounded-full shadow-lg overflow-hidden">
                    <Pressable onPress={() => router.push('/alerts' as any)}>
                        <BlurView intensity={80} tint="dark" className="p-2.5 relative">
                            <Bell size={20} color="white" />
                            <View className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                        </BlurView>
                    </Pressable>
                </View>

                <View className="rounded-full shadow-lg overflow-hidden">
                    <Pressable onPress={() => router.push('/profile' as any)}>
                        <BlurView intensity={80} tint="dark" className="p-2.5">
                            <User size={20} color="white" />
                        </BlurView>
                    </Pressable>
                </View>
            </View>

            {/* Filter Chips */}
            <View
                className="absolute left-0 right-0 z-40"
                style={{ top: insets.top > 0 ? insets.top + 80 : 100 }}
            >
                <FilterChips
                    chips={filterChips}
                    activeChip={activeFilter}
                    onSelect={setActiveFilter}
                />
            </View>

            {/* Zoom Controls */}
            <View className="absolute right-4 top-1/2 -translate-y-12 z-40 flex-col gap-2">
                <Pressable className="w-10 h-10 rounded-full shadow-lg bg-primary items-center justify-center">
                    <Plus size={20} color="white" />
                </Pressable>
                <Pressable className="w-10 h-10 rounded-full shadow-lg bg-primary items-center justify-center mt-2">
                    <Minus size={20} color="white" />
                </Pressable>
            </View>

            {/* FAB - Report Incident */}
            <Pressable
                onPress={handleReport}
                className="absolute right-4 z-50 items-center justify-center w-14 h-14 bg-accent rounded-full shadow-xl"
                style={{ bottom: 100 + insets.bottom }}
                accessibilityLabel="Rapòte Ensidan"
            >
                <Plus size={24} color="white" />
            </Pressable>

            {/* Zone Info Card */}
            {selectedZone && (
                <ZoneInfoCard
                    zone={selectedZone}
                    onClose={() => setSelectedZone(null)}
                    onViewRoute={handleViewRoute}
                    onReport={handleReport}
                />
            )}

            {/* Bottom Navigation */}
            <BottomNav />
        </View>
    );
}
