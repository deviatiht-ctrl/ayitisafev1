import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCamouflageStore } from '../lib/store';
import { cn } from '../lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Operator = '+' | '-' | '*' | '/';

export default function CalculatorScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { isActive, verifyPin, setActive } = useCamouflageStore();
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<Operator | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [pinAttempt, setPinAttempt] = useState('');

    useEffect(() => {
        if (!isActive) {
            // In a real app, you might redirect if they try to access it directly when inactive
        }
    }, [isActive]);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
            setPinAttempt(digit);
        } else {
            const newDisplay = display === '0' ? digit : display + digit;
            setDisplay(newDisplay);
            setPinAttempt(pinAttempt + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            setPinAttempt('');
        } else if (!display.includes('.')) {
            setDisplay(display + '.');
            setPinAttempt('');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        setPinAttempt('');
    };

    const toggleSign = () => {
        const value = parseFloat(display);
        setDisplay(String(value * -1));
        setPinAttempt('');
    };

    const inputPercent = () => {
        const value = parseFloat(display);
        setDisplay(String(value / 100));
        setPinAttempt('');
    };

    const calculate = (left: number, right: number, op: Operator): number => {
        switch (op) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return right !== 0 ? left / right : 0;
            default: return right;
        }
    };

    const performOperation = (nextOperator: Operator) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const result = calculate(previousValue, inputValue, operator);
            setDisplay(String(result));
            setPreviousValue(result);
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
        setPinAttempt('');
    };

    const handleEquals = () => {
        if (pinAttempt.length === 4 && verifyPin(pinAttempt)) {
            setActive(false);
            router.replace('/' as any);
            return;
        }

        if (operator && previousValue !== null) {
            const inputValue = parseFloat(display);
            const result = calculate(previousValue, inputValue, operator);
            setDisplay(String(result));
            setPreviousValue(null);
            setOperator(null);
            setWaitingForOperand(true);
        }
        setPinAttempt('');
    };

    const buttons = [
        { label: 'AC', action: clear, className: 'bg-gray-300', textClass: 'text-black' },
        { label: '+/-', action: toggleSign, className: 'bg-gray-300', textClass: 'text-black' },
        { label: '%', action: inputPercent, className: 'bg-gray-300', textClass: 'text-black' },
        { label: '÷', action: () => performOperation('/'), className: 'bg-accent', textClass: 'text-white' },

        { label: '7', action: () => inputDigit('7'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '8', action: () => inputDigit('8'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '9', action: () => inputDigit('9'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '×', action: () => performOperation('*'), className: 'bg-accent', textClass: 'text-white' },

        { label: '4', action: () => inputDigit('4'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '5', action: () => inputDigit('5'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '6', action: () => inputDigit('6'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '−', action: () => performOperation('-'), className: 'bg-accent', textClass: 'text-white' },

        { label: '1', action: () => inputDigit('1'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '2', action: () => inputDigit('2'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '3', action: () => inputDigit('3'), className: 'bg-gray-800', textClass: 'text-white' },
        { label: '+', action: () => performOperation('+'), className: 'bg-accent', textClass: 'text-white' },

        { label: '0', action: () => inputDigit('0'), className: 'bg-gray-800', textClass: 'text-white', isDouble: true },
        { label: '.', action: inputDecimal, className: 'bg-gray-800', textClass: 'text-white' },
        { label: '=', action: handleEquals, className: 'bg-accent', textClass: 'text-white' },
    ];

    const formatDisplay = (val: string) => {
        const num = parseFloat(val);
        if (isNaN(num)) return '0';
        if (val.length > 9) return num.toExponential(4);
        return val;
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 justify-end p-6">
                <Text
                    className="text-7xl font-light text-white text-right tracking-tight mb-4"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {formatDisplay(display)}
                </Text>

                <View className="flex-row flex-wrap justify-between">
                    {buttons.map((btn, idx) => (
                        <Pressable
                            key={idx}
                            onPress={btn.action}
                            className={cn(
                                'items-center justify-center rounded-full mb-3',
                                btn.className,
                                btn.isDouble ? 'w-[48%] items-start pl-8' : 'w-[22%] aspect-square'
                            )}
                            style={btn.isDouble ? { height: undefined, aspectRatio: 2.2 } : undefined}
                        >
                            <Text className={cn('text-3xl font-medium', btn.textClass)}>
                                {btn.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
