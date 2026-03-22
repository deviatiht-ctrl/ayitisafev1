import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { cn } from '../lib/utils';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend: 'up' | 'down' | 'neutral';
    trendValue: string;
}

export function KPICard({ title, value, icon, trend, trendValue }: KPICardProps) {
    return (
        <View className="bg-[#1e293b] rounded-xl border border-white/10 p-4 w-[48%] mb-3">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-medium text-white/70" numberOfLines={1}>{title}</Text>
                <View className="p-1.5 bg-white/10 rounded-lg">
                    {icon}
                </View>
            </View>

            <View className="flex-row items-end justify-between mt-1">
                <Text className="text-xl font-bold text-white">{value}</Text>
                <View className="flex-row items-center">
                    {trend === 'up' && <TrendingUp size={10} color="#EF4444" className="mr-1" />}
                    {trend === 'down' && <TrendingDown size={10} color="#22C55E" className="mr-1" />}
                    {trend === 'neutral' && <Minus size={10} color="#F59E0B" className="mr-1" />}
                    <Text className={cn(
                        'text-[10px] font-semibold',
                        trend === 'up' ? 'text-red-500' :
                            trend === 'down' ? 'text-green-500' : 'text-yellow-500'
                    )}>
                        {trendValue}
                    </Text>
                </View>
            </View>
        </View>
    );
}
