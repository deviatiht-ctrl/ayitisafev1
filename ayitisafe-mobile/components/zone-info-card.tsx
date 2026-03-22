import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, Navigation, FileWarning, Shield } from 'lucide-react-native';
import { cn } from '../lib/utils';
import type { Zone } from '../lib/mock-data';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ZoneInfoCardProps {
    zone: Zone;
    onClose: () => void;
    onViewRoute: () => void;
    onReport: () => void;
}

export function ZoneInfoCard({ zone, onClose, onViewRoute, onReport }: ZoneInfoCardProps) {
    const insets = useSafeAreaInsets();

    const riskLabels = {
        critical: 'KRITIK',
        warning: 'ATANSYON',
        safe: 'SEKIRITE',
    };

    const riskColors = {
        critical: 'bg-destructive',
        warning: 'bg-orange-500',
        safe: 'bg-green-500',
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutDown.duration(300)}
            className="absolute left-4 right-4 z-50"
            style={{ bottom: 100 + insets.bottom }}
        >
            <View className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <View className="p-4">
                    <View className="flex-row items-start justify-between mb-3">
                        <View>
                            <Text className="text-lg font-bold text-foreground">{zone.name}</Text>
                            <View className={cn('flex-row items-center px-2 py-1 rounded-full mt-1 self-start', riskColors[zone.risk])}>
                                <Shield size={12} color="white" className="mr-1" />
                                <Text className="text-xs font-bold text-white">{riskLabels[zone.risk]}</Text>
                            </View>
                        </View>
                        <Pressable
                            onPress={onClose}
                            className="p-2 rounded-full bg-muted/50"
                            hitSlop={10}
                        >
                            <X size={20} color="hsl(var(--muted-foreground))" />
                        </Pressable>
                    </View>

                    <View className="mt-2 space-y-3">
                        <View className="flex-row items-center">
                            <FileWarning size={16} color="hsl(var(--muted-foreground))" className="mr-2" />
                            <Text className="text-sm text-muted-foreground">{zone.lastIncident}</Text>
                        </View>

                        <View className="mt-2">
                            <View className="flex-row items-center justify-between mb-1">
                                <Text className="text-sm text-muted-foreground">Konfyans IA</Text>
                                <Text className="text-sm font-bold text-accent">{zone.aiScore}%</Text>
                            </View>
                            <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <View className="h-full bg-accent rounded-full" style={{ width: `${zone.aiScore}%` }} />
                            </View>
                        </View>

                        <View className="flex-row items-center mt-2">
                            <Text className="text-sm text-muted-foreground">Ensidan aktif: </Text>
                            <Text className="text-sm font-bold text-foreground">{zone.incidentCount}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row px-4 pb-4 mt-2">
                    <Pressable
                        onPress={onViewRoute}
                        className="flex-1 flex-row items-center justify-center bg-accent py-3 rounded-lg mr-2"
                    >
                        <Navigation size={16} color="white" className="mr-2" />
                        <Text className="text-white font-semibold">Wè Wout</Text>
                    </Pressable>
                    <Pressable
                        onPress={onReport}
                        className="flex-1 flex-row items-center justify-center border border-primary py-3 rounded-lg"
                    >
                        <FileWarning size={16} color="hsl(var(--primary))" className="mr-2" />
                        <Text className="text-primary font-semibold">Rapòte</Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
}
