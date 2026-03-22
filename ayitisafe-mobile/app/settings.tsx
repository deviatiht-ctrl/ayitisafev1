import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Moon, Sun, Globe, Bell, MapPin,
    Shield, AlertTriangle, Trash2, Eye, EyeOff, Calculator, Check
} from 'lucide-react-native';
import { BottomNav } from '../components/bottom-nav';
import { useCamouflageStore, useAppStore } from '../lib/store';
import { cn } from '../lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const languages = [
    { id: 'ht', label: 'Kreyòl' },
    { id: 'fr', label: 'Français' },
    { id: 'en', label: 'English' },
];

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { darkMode, setDarkMode } = useAppStore();
    const { isActive, pin, setActive, setPin } = useCamouflageStore();

    const [selectedLanguage, setSelectedLanguage] = useState('ht');
    const [criticalAlerts, setCriticalAlerts] = useState(true);
    const [warningAlerts, setWarningAlerts] = useState(true);
    const [newsAlerts, setNewsAlerts] = useState(false);
    const [shareLocation, setShareLocation] = useState(true);
    const [anonymousReports, setAnonymousReports] = useState(false);
    const [showPinInput, setShowPinInput] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [showPin, setShowPin] = useState(false);

    const handleCamouflageToggle = (checked: boolean) => {
        if (checked && !pin) {
            setShowPinInput(true);
        } else {
            setActive(checked);
        }
    };

    const handlePinSave = () => {
        if (newPin.length === 4) {
            setPin(newPin);
            setActive(true);
            setShowPinInput(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="bg-background border-b border-border z-40" style={{ paddingTop: Math.max(insets.top, 16) }}>
                <View className="px-4 py-4 flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="p-2 -ml-2 rounded-full mr-2"
                    >
                        <ArrowLeft size={20} color="hsl(var(--foreground))" />
                    </Pressable>
                    <Text className="text-lg font-bold text-foreground">Paramèt</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Appearance Section */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Aparans
                    </Text>
                    <View className="bg-card rounded-xl border border-border">
                        <View className="flex-row items-center justify-between p-4">
                            <View className="flex-row items-center flex-1">
                                {darkMode ? <Moon size={20} color="hsl(var(--accent))" className="mr-3" /> : <Sun size={20} color="hsl(var(--accent))" className="mr-3" />}
                                <View>
                                    <Text className="text-sm font-medium text-foreground">Mòd Fènwa</Text>
                                    <Text className="text-xs text-muted-foreground">Chanje aparans aplikasyon an</Text>
                                </View>
                            </View>
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                                trackColor={{ false: 'hsl(var(--border))', true: 'hsl(var(--accent))' }}
                            />
                        </View>
                    </View>
                </View>

                {/* Language Section */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Lang
                    </Text>
                    <View className="bg-card rounded-xl border border-border p-4">
                        <View className="flex-row items-center mb-3">
                            <Globe size={20} color="hsl(var(--accent))" className="mr-3" />
                            <Text className="text-sm font-medium text-foreground">Chwazi lang ou</Text>
                        </View>
                        <View className="flex-row gap-2 object-cover">
                            {languages.map((lang) => (
                                <Pressable
                                    key={lang.id}
                                    onPress={() => setSelectedLanguage(lang.id)}
                                    className={cn(
                                        'flex-1 py-2 px-1 rounded-lg items-center flex-row justify-center',
                                        selectedLanguage === lang.id
                                            ? 'bg-accent'
                                            : 'bg-muted'
                                    )}
                                >
                                    {selectedLanguage === lang.id && <Check size={12} color="white" className="mr-1" />}
                                    <Text className={cn("text-xs font-medium", selectedLanguage === lang.id ? "text-white" : "text-muted-foreground")}>
                                        {lang.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Notifications Section */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Notifikasyon
                    </Text>
                    <View className="bg-card rounded-xl border border-border">
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center flex-1">
                                <Bell size={20} color="#EF4444" className="mr-3" />
                                <View>
                                    <Text className="text-sm font-medium text-foreground">Alèt Kritik</Text>
                                    <Text className="text-xs text-muted-foreground">Tire, kidnapping...</Text>
                                </View>
                            </View>
                            <Switch value={criticalAlerts} onValueChange={setCriticalAlerts} trackColor={{ true: 'hsl(var(--accent))' }} />
                        </View>
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center flex-1">
                                <Bell size={20} color="#F97316" className="mr-3" />
                                <View>
                                    <Text className="text-sm font-medium text-foreground">Alèt Atansyon</Text>
                                    <Text className="text-xs text-muted-foreground">Barikad, manifestasyon...</Text>
                                </View>
                            </View>
                            <Switch value={warningAlerts} onValueChange={setWarningAlerts} trackColor={{ true: 'hsl(var(--accent))' }} />
                        </View>
                        <View className="flex-row items-center justify-between p-4 border-b border-border">
                            <View className="flex-row items-center flex-1">
                                <Bell size={20} color="hsl(var(--muted-foreground))" className="mr-3" />
                                <View>
                                    <Text className="text-sm font-medium text-foreground">Nouvèl Sekirite</Text>
                                    <Text className="text-xs text-muted-foreground">Aktyalite ak konsèy</Text>
                                </View>
                            </View>
                            <Switch value={newsAlerts} onValueChange={setNewsAlerts} trackColor={{ true: 'hsl(var(--accent))' }} />
                        </View>
                        <View className="p-4">
                            <View className="flex-row items-center mb-1">
                                <MapPin size={20} color="hsl(var(--accent))" className="mr-3" />
                                <Text className="text-sm font-medium text-foreground">Radis alèt</Text>
                            </View>
                            <Text className="text-xs text-muted-foreground ml-8">Pre mwen nan 5km</Text>
                        </View>
                    </View>
                </View>

                {/* Camouflage Mode Section */}
                <View className="mb-6">
                    <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Mòd Kamouflaj
                    </Text>
                    <View className="bg-primary rounded-xl overflow-hidden p-4">
                        <View className="flex-row items-start mb-4">
                            <View className="p-2 bg-accent/20 rounded-lg mr-3">
                                <Calculator size={20} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-bold text-white">Kache app ou a</Text>
                                <Text className="text-xs text-white/80 mt-1">
                                    App la ap parèt tankou yon kalkilatris si ou nan danje
                                </Text>
                            </View>
                        </View>

                        {!showPinInput ? (
                            <View>
                                <View className="flex-row items-center justify-between mb-3">
                                    <Text className="text-sm text-white">Aktive Kamouflaj</Text>
                                    <Switch
                                        value={isActive}
                                        onValueChange={handleCamouflageToggle}
                                        trackColor={{ false: 'hsl(var(--border))', true: 'hsl(var(--accent))' }}
                                    />
                                </View>

                                {isActive && (
                                    <View className="p-3 bg-orange-500/20 rounded-lg flex-row items-start mb-3">
                                        <AlertTriangle size={16} color="#F97316" className="mr-2 mt-0.5" />
                                        <Text className="text-xs text-white flex-1">
                                            Kamouflaj aktif — App w ap parèt tankou yon kalkilatris.
                                            Tape PIN ou ({pin}) pou retounen.
                                        </Text>
                                    </View>
                                )}

                                {pin && (
                                    <Pressable onPress={() => setShowPinInput(true)}>
                                        <Text className="text-xs text-accent underline">Chanje PIN</Text>
                                    </Pressable>
                                )}
                            </View>
                        ) : (
                            <View>
                                <Text className="text-xs text-white/80 mb-2">Antre yon PIN 4 chif</Text>
                                <View className="flex-row items-center bg-white/10 rounded-xl mb-3 pr-2 border border-white/20">
                                    <TextInput
                                        secureTextEntry={!showPin}
                                        value={newPin}
                                        onChangeText={(t) => setNewPin(t.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="____"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        className="flex-1 text-white text-center text-lg tracking-[0.5em] py-3"
                                    />
                                    <Pressable onPress={() => setShowPin(!showPin)} className="p-2">
                                        {showPin ? <EyeOff size={16} color="white" /> : <Eye size={16} color="white" />}
                                    </Pressable>
                                </View>

                                <View className="flex-row gap-2">
                                    <Pressable
                                        onPress={() => { setShowPinInput(false); setNewPin(''); }}
                                        className="flex-1 py-2 rounded-lg border border-white/30 items-center"
                                    >
                                        <Text className="text-white text-sm">Anile</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={handlePinSave}
                                        disabled={newPin.length !== 4}
                                        className={cn("flex-1 py-2 rounded-lg items-center", newPin.length === 4 ? "bg-accent" : "bg-accent/50")}
                                    >
                                        <Text className="text-white text-sm font-semibold">Sove PIN</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <View className="items-center py-4 mb-4">
                    <Text className="text-xs text-muted-foreground">AyitiSafe v1.0.0</Text>
                    <Text className="text-xs text-muted-foreground">Made with care for Haiti</Text>
                </View>

            </ScrollView>
            <BottomNav />
        </View>
    );
}
