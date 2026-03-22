import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
    Crosshair, UserX, Car, Construction, Users,
    AlertTriangle, Droplets, Flame, HelpCircle
} from 'lucide-react-native';
import { cn } from '../lib/utils';

const incidentTypes = [
    { id: 'shooting', icon: Crosshair, label: 'Tire', color: '#EF4444' },
    { id: 'kidnapping', icon: UserX, label: 'Kidnapping', color: '#1B2A4A' },
    { id: 'accident', icon: Car, label: 'Aksidan', color: '#F97316' },
    { id: 'barricade', icon: Construction, label: 'Barikad', color: '#F59E0B' },
    { id: 'protest', icon: Users, label: 'Manifestasyon', color: '#8B5CF6' },
    { id: 'road_hazard', icon: AlertTriangle, label: 'Wout Danjere', color: '#F59E0B' },
    { id: 'flood', icon: Droplets, label: 'Inon', color: '#3B82F6' },
    { id: 'fire', icon: Flame, label: 'Dife', color: '#EF4444' },
    { id: 'other', icon: HelpCircle, label: 'Lòt', color: '#6B7280' },
];

interface IncidentTypeGridProps {
    selectedType: string | null;
    onSelect: (type: string) => void;
}

export function IncidentTypeGrid({ selectedType, onSelect }: IncidentTypeGridProps) {
    return (
        <View className="flex-row flex-wrap justify-between">
            {incidentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                    <Pressable
                        key={type.id}
                        onPress={() => onSelect(type.id)}
                        className={cn(
                            'items-center justify-center p-3 rounded-xl border-2 mb-2 w-[31%]',
                            isSelected
                                ? 'border-accent bg-accent/10'
                                : 'border-border bg-card'
                        )}
                    >
                        <View
                            className={cn(
                                'items-center justify-center w-10 h-10 rounded-full mb-2',
                                isSelected ? 'bg-accent/20' : 'bg-muted'
                            )}
                        >
                            <Icon size={20} color={type.color} />
                        </View>
                        <Text className="text-xs font-semibold text-foreground text-center" numberOfLines={1}>
                            {type.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
