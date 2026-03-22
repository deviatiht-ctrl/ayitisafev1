import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, AlertTriangle, MapPin, Users, Bell, UserCheck
} from 'lucide-react-native';
import { KPICard } from '../components/kpi-card';
import { dashboardStats, officers, recentIncidents } from '../lib/mock-data';
import { cn } from '../lib/utils';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20',
    'in-progress': 'bg-orange-500/20',
    resolved: 'bg-green-500/20',
};

const statusTextColors: Record<string, string> = {
    pending: 'text-yellow-500',
    'in-progress': 'text-orange-500',
    resolved: 'text-green-500',
};

const statusLabels: Record<string, string> = {
    pending: 'An Atant',
    'in-progress': 'En Kou',
    resolved: 'Rezoud',
};

const officerStatusColors: Record<string, string> = {
    active: 'bg-green-500',
    busy: 'bg-yellow-500',
    offline: 'bg-gray-500',
};

const chartConfig = {
    backgroundColor: '#1e293b',
    backgroundGradientFrom: '#1e293b',
    backgroundGradientTo: '#1e293b',
    color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
};

export default function AdminScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedIncident, setSelectedIncident] = useState<number | null>(null);

    // Line Chart Data
    const lineData = {
        labels: ['Lun', 'Mad', 'Mèk', 'Jed', 'Van', 'Sam', 'Dim'],
        datasets: [{ data: dashboardStats.incidentTrend }]
    };

    // Pie Chart Data
    const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#6B7280'];
    const pieData = dashboardStats.zoneDistribution.map((z, i) => ({
        name: z.name,
        population: z.value,
        color: COLORS[i % COLORS.length],
        legendFontColor: '#fff',
        legendFontSize: 10
    }));

    // Bar Chart Data
    const barData = {
        labels: dashboardStats.incidentsByType.map(i => i.type),
        datasets: [{ data: dashboardStats.incidentsByType.map(i => i.count) }]
    };

    return (
        <View className="flex-1 bg-slate-900">
            {/* Header */}
            <View className="bg-slate-900 border-b border-white/10 z-40" style={{ paddingTop: Math.max(insets.top, 16) }}>
                <View className="px-4 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full mr-2">
                            <ArrowLeft size={20} color="white" />
                        </Pressable>
                        <Text className="text-lg font-bold text-white">Dashboard Ofisyèl</Text>
                    </View>
                    <View className="px-3 py-1 bg-orange-500 rounded-full">
                        <Text className="text-xs font-bold text-white">ADMIN</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* KPI Cards */}
                <View className="flex-row flex-wrap justify-between mb-4">
                    <KPICard
                        title="Ensidan Aktif"
                        value={dashboardStats.activeIncidents}
                        icon={<AlertTriangle size={14} color="#EF4444" />}
                        trend="up"
                        trendValue="+12%"
                    />
                    <KPICard
                        title="Zòn Rouj"
                        value={dashboardStats.redZones}
                        icon={<MapPin size={14} color="#EF4444" />}
                        trend="neutral"
                        trendValue="san chanjman"
                    />
                    <KPICard
                        title="Ofisye Aktif"
                        value={dashboardStats.activeOfficers}
                        icon={<Users size={14} color="#22C55E" />}
                        trend="down"
                        trendValue="-3"
                    />
                    <KPICard
                        title="Alèt Voye"
                        value={dashboardStats.alertsSent}
                        icon={<Bell size={14} color="#F97316" />}
                        trend="up"
                        trendValue="+28%"
                    />
                </View>

                {/* Incident Table */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                        Ensidan Resan
                    </Text>
                    <View className="bg-slate-800 rounded-xl overflow-hidden">
                        {recentIncidents.map((incident, idx) => (
                            <View
                                key={incident.id}
                                className={cn(
                                    "flex-row items-center justify-between p-3",
                                    idx !== recentIncidents.length - 1 && "border-b border-white/5"
                                )}
                            >
                                <View className="flex-1 mr-2">
                                    <Text className="text-xs text-white/50 mb-1">#{incident.id} • {incident.location}</Text>
                                    <Text className="text-sm text-white font-medium capitalize">{incident.type}</Text>
                                </View>
                                <View className="items-end">
                                    <View className={cn('px-2 py-1 rounded-full mb-2', statusColors[incident.status])}>
                                        <Text className={cn("text-[10px] font-bold", statusTextColors[incident.status])}>
                                            {statusLabels[incident.status]}
                                        </Text>
                                    </View>
                                    <Pressable
                                        onPress={() => setSelectedIncident(incident.id)}
                                        className="border border-orange-500 rounded px-2 py-1"
                                    >
                                        <Text className="text-[10px] text-orange-500 font-medium">Asiye Ofisye</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Charts */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                        Tendans Ensidan (7 dènye jou)
                    </Text>
                    <View className="bg-slate-800 rounded-xl p-4 items-center">
                        <LineChart
                            data={lineData}
                            width={screenWidth - 64}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 16 }}
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                        Distribisyon Zòn
                    </Text>
                    <View className="bg-slate-800 rounded-xl p-4 items-center">
                        <PieChart
                            data={pieData}
                            width={screenWidth - 64}
                            height={180}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"-10"}
                            absolute
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                        Pa Kategori
                    </Text>
                    <View className="bg-slate-800 rounded-xl p-4 items-center">
                        <BarChart
                            data={barData}
                            width={screenWidth - 64}
                            height={200}
                            chartConfig={{ ...chartConfig, barPercentage: 0.8 }}
                            yAxisLabel=""
                            yAxisSuffix=""
                            showValuesOnTopOfBars
                        />
                    </View>
                </View>

                {/* Officer Deployment */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                        Deplwaman Ofisye
                    </Text>
                    <View className="bg-slate-800 rounded-xl overflow-hidden divide-y divide-white/10">
                        {officers.map((officer) => (
                            <View key={officer.id} className="flex-row items-center justify-between p-4 border-b border-white/5">
                                <View className="flex-row items-center gap-3">
                                    <View className="relative">
                                        <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                                            <Text className="text-white font-medium">
                                                {officer.name.split(' ').slice(1).map(n => n[0]).join('')}
                                            </Text>
                                        </View>
                                        <View className={cn(
                                            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800',
                                            officerStatusColors[officer.status]
                                        )} />
                                    </View>
                                    <View>
                                        <Text className="text-sm font-medium text-white">{officer.name}</Text>
                                        <Text className="text-xs text-white/50">{officer.zone}</Text>
                                    </View>
                                </View>
                                <Pressable
                                    disabled={officer.status === 'offline'}
                                    className={cn(
                                        "flex-row items-center px-3 py-1.5 rounded border",
                                        officer.status === 'offline' ? "border-white/10 opacity-50" : "border-white/30"
                                    )}
                                >
                                    <UserCheck size={12} color="white" className="mr-1" />
                                    <Text className="text-[10px] text-white font-medium">Deplwaye</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
