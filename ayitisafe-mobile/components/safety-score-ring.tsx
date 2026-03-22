import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { cn } from '../lib/utils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SafetyScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export function SafetyScoreRing({
    score,
    size = 120,
    strokeWidth = 10,
    className
}: SafetyScoreRingProps) {
    const animatedScore = useSharedValue(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        animatedScore.value = withTiming(score, {
            duration: 1000,
            easing: Easing.out(Easing.ease),
        });
    }, [score]);

    const animatedProps = useAnimatedProps(() => {
        const offset = circumference - (animatedScore.value / 100) * circumference;
        return {
            strokeDashoffset: offset,
        };
    });

    const getScoreColor = (value: number) => {
        if (value >= 80) return 'text-green-500';
        if (value >= 60) return 'text-orange-500';
        if (value >= 40) return 'text-yellow-500';
        return 'text-destructive';
    };

    const getStrokeColor = (value: number) => {
        if (value >= 80) return '#22C55E';
        if (value >= 60) return '#F97316';
        if (value >= 40) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <View className={cn('items-center justify-center', className)}>
            <View style={{ transform: [{ rotate: '-90deg' }] }}>
                <Svg width={size} height={size}>
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={getStrokeColor(score)}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                    />
                </Svg>
            </View>
            <View className="absolute inset-0 items-center justify-center">
                <Text className={cn('text-3xl font-bold', getScoreColor(score))}>
                    {Math.round(score)}%
                </Text>
            </View>
        </View>
    );
}
