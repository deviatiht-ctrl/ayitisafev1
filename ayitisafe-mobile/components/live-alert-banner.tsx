import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';
import { cn } from '../lib/utils';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiveAlertBannerProps {
    message: string;
    onDismiss?: () => void;
    severity?: 'critical' | 'warning';
}

export function LiveAlertBanner({
    message,
    onDismiss,
    severity = 'critical'
}: LiveAlertBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const timer = setTimeout(() => {
            handleDismiss();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            onDismiss?.();
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutUp.duration(300)}
            className="absolute top-0 left-0 right-0 z-[60]"
            style={{ paddingTop: Math.max(insets.top, 16) }}
        >
            <View
                className={cn(
                    'flex-row items-center px-4 py-3 mx-4 rounded-xl shadow-lg',
                    severity === 'critical' ? 'bg-destructive' : 'bg-warning'
                )}
            >
                <AlertTriangle size={20} color="white" className="mr-3" />
                <Text className="flex-1 text-sm font-medium text-white">{message}</Text>
                <Pressable
                    onPress={handleDismiss}
                    className="p-1 rounded-full items-center justify-center bg-white/20 ml-2"
                    hitSlop={10}
                >
                    <X size={16} color="white" />
                </Pressable>
            </View>
        </Animated.View>
    );
}
