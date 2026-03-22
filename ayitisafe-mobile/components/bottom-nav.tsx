import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Map, Bell, Plus, User, Settings } from 'lucide-react-native';
import { cn } from '../lib/utils';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const navItems = [
    { href: '/', icon: Map, label: 'Kat' },
    { href: '/alerts', icon: Bell, label: 'Alèt', badge: 5 },
    { href: '/report', icon: Plus, label: '', isCenter: true },
    { href: '/profile', icon: User, label: 'Pwofil' },
    { href: '/settings', icon: Settings, label: 'Paramèt' },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            className="absolute bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
            <View className="flex-row items-center justify-around h-16 w-full max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isCenter) {
                        return (
                            <Pressable
                                key={item.href}
                                onPress={() => router.push(item.href as any)}
                                className="relative -mt-6"
                                accessibilityLabel="Rapòte Ensidan"
                            >
                                <View className="flex items-center justify-center w-14 h-14 rounded-full bg-accent shadow-lg">
                                    <Icon size={24} color="#FFF" />
                                </View>
                            </Pressable>
                        );
                    }

                    return (
                        <Pressable
                            key={item.href}
                            onPress={() => router.push(item.href as any)}
                            className="items-center justify-center px-3 py-2"
                        >
                            <View className="relative mb-1">
                                <Icon size={22} color={isActive ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"} />
                                {item.badge && (
                                    <View className="absolute -top-1.5 -right-2.5 items-center justify-center w-4 h-4 bg-destructive rounded-full">
                                        <Text className="text-[10px] font-bold text-white">{item.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text className={cn("text-[10px] font-medium", isActive ? 'text-accent' : 'text-muted-foreground')}>
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
