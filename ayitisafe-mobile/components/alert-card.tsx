import React from 'react';
import { View, Text, Pressable, Share } from 'react-native';
import {
    Crosshair, UserX, Car, Construction, Users, Shield,
    AlertTriangle, Droplets, MapPin, Share2, Sparkles
} from 'lucide-react-native';
import { cn } from '../lib/utils';
import type { Alert } from '../lib/mock-data';

const typeIcons: Record<string, any> = {
    shooting: Crosshair,
    kidnapping: UserX,
    accident: Car,
    barricade: Construction,
    protest: Users,
    patrol: Shield,
    road_hazard: AlertTriangle,
    flood: Droplets,
};

const severityColors = {
    critical: 'border-l-destructive bg-destructive/10',
    warning: 'border-l-warning bg-orange-500/10',
    safe: 'border-l-success bg-green-500/10',
};

const severityBadgeColors = {
    critical: 'bg-destructive',
    warning: 'bg-orange-500',
    safe: 'bg-green-500',
};

const severityLabels = {
    critical: 'KRITIK',
    warning: 'ATANSYON',
    safe: 'SEKIRITE',
};

interface AlertCardProps {
    alert: Alert;
    onViewOnMap: () => void;
    onShare: () => void;
    className?: string;
}

export function AlertCard({ alert, onViewOnMap, onShare, className }: AlertCardProps) {
    const Icon = typeIcons[alert.type] || AlertTriangle;

    return (
        <View
            className={cn(
                'bg-card rounded-xl border border-border border-l-4 p-4 shadow-sm mb-3',
                severityColors[alert.severity],
                className
            )}
        >
            <View className="flex-row gap-3">
                {/* Icon */}
                <View
                    className={cn(
                        'items-center justify-center w-10 h-10 rounded-full',
                        alert.severity === 'critical' ? 'bg-destructive/20' : '',
                        alert.severity === 'warning' ? 'bg-orange-500/20' : '',
                        alert.severity === 'safe' ? 'bg-green-500/20' : ''
                    )}
                >
                    <Icon
                        size={20}
                        color={
                            alert.severity === 'critical' ? '#EF4444' :
                                alert.severity === 'warning' ? '#F97316' : '#22C55E'
                        }
                    />
                </View>

                {/* Content */}
                <View className="flex-1">
                    <View className="flex-row items-start justify-between gap-2 mb-1">
                        <Text className="font-semibold text-foreground text-sm flex-1" numberOfLines={2}>
                            {alert.title}
                        </Text>
                        <View
                            className={cn(
                                'px-2 py-0.5 rounded-full',
                                severityBadgeColors[alert.severity]
                            )}
                        >
                            <Text className="text-[10px] font-bold text-white">
                                {severityLabels[alert.severity]}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-1 mb-2">
                        <MapPin size={12} color="hsl(var(--muted-foreground))" />
                        <Text className="text-xs text-muted-foreground">{alert.location}, {alert.street}</Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <Text className="text-xs text-muted-foreground">Poste {alert.time}</Text>
                            <View className="flex-row items-center gap-1">
                                <Sparkles size={12} color="hsl(var(--accent))" />
                                <Text className="text-xs text-accent">IA: {alert.aiScore}%</Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-2 mt-3">
                        <Pressable
                            className="flex-1 flex-row items-center justify-center h-8 border border-border rounded-md"
                            onPress={onViewOnMap}
                        >
                            <MapPin size={12} color="hsl(var(--foreground))" className="mr-1" />
                            <Text className="text-xs font-medium text-foreground">Wè sou Kat</Text>
                        </Pressable>
                        <Pressable
                            className="flex-1 flex-row items-center justify-center h-8 border border-border rounded-md"
                            onPress={onShare}
                        >
                            <Share2 size={12} color="hsl(var(--foreground))" className="mr-1" />
                            <Text className="text-xs font-medium text-foreground">Pataje Alèt</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}
