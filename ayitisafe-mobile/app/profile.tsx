import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
    Camera, MapPin, Phone, FileText, Navigation,
    Bell, ChevronRight, LogOut, Shield, UserPlus
} from 'lucide-react-native';
import { BottomNav } from '../components/bottom-nav';
import { SafetyScoreRing } from '../components/safety-score-ring';
import { currentUser, safeRoutes, emergencyContacts, recentIncidents } from '../lib/mock-data';
import { cn } from '../lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const incidentTypeLabels: Record<string, string> = {
    shooting: 'Tire',
    kidnapping: 'Kidnapping',
    accident: 'Aksidan',
    barricade: 'Barikad',
    protest: 'Manifestasyon',
};

const statusColors: Record<string, string> = {
    pending: 'bg-warning',
    'in-progress': 'bg-accent',
    resolved: 'bg-green-500',
};

const statusLabels: Record<string, string> = {
    pending: 'An Atant',
    'in-progress': 'An Kou',
    resolved: 'Rezoud',
};

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-background">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
                {/* Hero Section */}
                <View className="bg-primary" style={{ paddingTop: Math.max(insets.top, 16) }}>
                    <View className="px-4 py-8">
                        {/* Avatar */}
                        <View className="items-center mb-4">
                            <View className="relative">
                                <View className="w-20 h-20 rounded-full bg-primary-foreground/20 items-center justify-center">
                                    <Text className="text-3xl font-bold text-white">
                                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                                <Pressable className="absolute -bottom-1 -right-1 p-1.5 bg-accent rounded-full border-2 border-primary">
                                    <Camera size={14} color="white" />
                                </Pressable>
                            </View>
                        </View>

                        {/* User Info */}
                        <View className="items-center">
                            <Text className="text-xl font-bold mb-1 text-white">{currentUser.name}</Text>
                            <View className="flex-row items-center gap-1 mb-1">
                                <MapPin size={14} color="rgba(255,255,255,0.8)" />
                                <Text className="text-sm text-primary-foreground/80">{currentUser.zone}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Phone size={14} color="rgba(255,255,255,0.8)" />
                                <Text className="text-sm text-primary-foreground/80">{currentUser.phone}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Safety Score Section */}
                <View className="px-4 -mt-8">
                    <View className="bg-card rounded-2xl shadow-md p-6 items-center border border-border">
                        <SafetyScoreRing score={currentUser.safetyScore} className="mb-3" />
                        <Text className="text-sm text-muted-foreground">Nivo Sekirite ou</Text>

                        {/* Stats Row */}
                        <View className="flex-row items-center justify-around mt-6 pt-6 border-t border-border w-full">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-foreground">{currentUser.reportsCount}</Text>
                                <Text className="text-xs text-muted-foreground">Rapò</Text>
                            </View>
                            <View className="w-px h-10 bg-border" />
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-foreground">{currentUser.savedRoutes}</Text>
                                <Text className="text-xs text-muted-foreground">Wout</Text>
                            </View>
                            <View className="w-px h-10 bg-border" />
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-foreground">{currentUser.alertsReceived}</Text>
                                <Text className="text-xs text-muted-foreground">Alèt</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* My Reports */}
                <View className="px-4 mt-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-semibold text-foreground">Rapò Mwen</Text>
                        <Text className="text-sm text-accent">Wè tout</Text>
                    </View>

                    <View className="space-y-2">
                        {recentIncidents.slice(0, 3).map((incident) => (
                            <View
                                key={incident.id}
                                className="flex-row items-center p-3 bg-card rounded-xl border border-border mb-2"
                            >
                                <View className="items-center justify-center w-10 h-10 rounded-full bg-muted mr-3">
                                    <FileText size={20} color="hsl(var(--muted-foreground))" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                                        {incidentTypeLabels[incident.type] || incident.type}
                                    </Text>
                                    <Text className="text-xs text-muted-foreground">{incident.location}</Text>
                                </View>
                                <View className={cn('px-2 py-0.5 rounded-full', statusColors[incident.status])}>
                                    <Text className="text-[10px] font-semibold text-white">
                                        {statusLabels[incident.status]}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Saved Routes */}
                <View className="mt-6">
                    <View className="flex-row items-center justify-between px-4 mb-3">
                        <Text className="text-lg font-semibold text-foreground">Wout Sove</Text>
                        <Text className="text-sm text-accent">Wè tout</Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                        {safeRoutes.map((route) => (
                            <View
                                key={route.id}
                                className="w-64 p-4 bg-card rounded-xl border border-border"
                            >
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Navigation size={16} color="hsl(var(--accent))" className="mr-1" />
                                    <Text className="text-sm font-medium text-foreground">{route.name}</Text>
                                </View>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-xs text-muted-foreground">{route.distance}</Text>
                                    <View className="flex-row items-center gap-1">
                                        <Shield size={12} color="#22C55E" />
                                        <Text className="text-xs text-muted-foreground">{route.safetyScore}%</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Quick Actions */}
                <View className="px-4 mt-6 space-y-2 mb-4">
                    <Pressable
                        onPress={() => router.push('/settings' as any)}
                        className="flex-row items-center w-full p-4 bg-card rounded-xl border border-border mb-2"
                    >
                        <Bell size={20} color="hsl(var(--muted-foreground))" className="mr-3" />
                        <Text className="flex-1 text-sm font-medium text-foreground">Paramèt</Text>
                        <ChevronRight size={20} color="hsl(var(--muted-foreground))" />
                    </Pressable>

                    {currentUser.role === 'admin' && (
                        <Pressable
                            className="flex-row items-center w-full p-4 bg-primary rounded-xl mb-2"
                        >
                            <Shield size={20} color="white" className="mr-3" />
                            <Text className="flex-1 text-sm font-medium text-primary-foreground">Dashboard Admin</Text>
                            <View className="px-2 py-0.5 bg-accent rounded">
                                <Text className="text-xs font-bold text-white">ADMIN</Text>
                            </View>
                        </Pressable>
                    )}

                    <Pressable className="flex-row items-center w-full p-4 border border-destructive rounded-xl">
                        <LogOut size={20} color="#EF4444" className="mr-3" />
                        <Text className="flex-1 text-sm font-medium text-destructive">Dekonekte</Text>
                    </Pressable>
                </View>

            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav />
        </View>
    );
}
