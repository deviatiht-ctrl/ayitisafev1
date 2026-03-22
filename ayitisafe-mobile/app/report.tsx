import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, ArrowRight, MapPin, Camera, Check, X, Crosshair
} from 'lucide-react-native';
import { IncidentTypeGrid } from '../components/incident-type-grid';
import { cn } from '../lib/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const steps = [
    { id: 1, title: 'Lokalite', description: 'Kote ensidan an ye?' },
    { id: 2, title: 'Tip Ensidan', description: 'Ki kalite ensidan?' },
    { id: 3, title: 'Detay', description: 'Dekri sa ou wè' },
    { id: 4, title: 'Konfirmasyon', description: 'Revize rapò ou' },
];

const severityOptions = [
    { id: 'low', label: 'Ba' },
    { id: 'medium', label: 'Mwayen' },
    { id: 'high', label: 'Wo' },
];

interface ReportData {
    location: { lat: number; lng: number } | null;
    address: string;
    incidentType: string | null;
    description: string;
    photos: string[];
    isAnonymous: boolean;
    severity: string;
}

export default function ReportScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [reportData, setReportData] = useState<ReportData>({
        location: null,
        address: '',
        incidentType: null,
        description: '',
        photos: [],
        isAnonymous: false,
        severity: 'medium',
    });

    const progress = (currentStep / steps.length) * 100;

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return reportData.location !== null;
            case 2:
                return reportData.incidentType !== null;
            case 3:
                return reportData.description.trim().length > 0;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    const handleUseMyLocation = () => {
        // Mock simulation
        setReportData({
            ...reportData,
            location: { lat: 18.5392, lng: -72.3288 },
            address: 'Port-au-Prince, Haiti',
        });
    };

    const handleMapClick = () => {
        setReportData({
            ...reportData,
            location: { lat: 18.5450, lng: -72.3250 },
            address: 'Delmas 33',
        });
    };

    const handlePhotoUpload = () => {
        const mockPhoto = `https://picsum.photos/200/200?random=${Date.now()}`;
        setReportData({
            ...reportData,
            photos: [...reportData.photos, mockPhoto],
        });
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...reportData.photos];
        newPhotos.splice(index, 1);
        setReportData({ ...reportData, photos: newPhotos });
    };

    if (isSubmitted) {
        return (
            <View className="flex-1 bg-background justify-center items-center px-4">
                <View className="items-center w-full max-w-sm">
                    <View className="items-center justify-center w-20 h-20 mb-6 bg-green-500/10 rounded-full">
                        <Check size={40} color="#22C55E" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground mb-2 text-center">Mèsi!</Text>
                    <Text className="text-muted-foreground mb-6 text-center">
                        Rapò w resevwa. Ekip nou ap analize l.
                    </Text>
                    <Pressable
                        onPress={() => router.replace('/' as any)}
                        className="w-full bg-accent py-4 rounded-xl items-center justify-center"
                    >
                        <Text className="text-white font-semibold">Retounen nan Kat</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="bg-background border-b border-border z-40" style={{ paddingTop: Math.max(insets.top, 16) }}>
                <View className="px-4 py-4">
                    <View className="flex-row items-center mb-4">
                        <Pressable
                            onPress={() => router.back()}
                            className="p-2 -ml-2 rounded-full mr-2"
                        >
                            <ArrowLeft size={20} color="hsl(var(--foreground))" />
                        </Pressable>
                        <View>
                            <Text className="text-lg font-bold text-foreground">Rapòte Ensidan</Text>
                            <Text className="text-sm text-muted-foreground">
                                Etap {currentStep} nan {steps.length}: {steps[currentStep - 1].title}
                            </Text>
                        </View>
                    </View>
                    <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <View className="h-full bg-accent rounded-full" style={{ width: `${progress}%` }} />
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Step 1: Location */}
                {currentStep === 1 && (
                    <View className="space-y-4">
                        <Text className="text-sm text-muted-foreground mb-4">
                            Deplase epeng lan sou kote ensidan an ye oswa chwazi pozisyon w.
                        </Text>

                        <Pressable
                            onPress={handleMapClick}
                            className="w-full h-[220px] bg-muted flex items-center justify-center rounded-xl mb-4"
                        >
                            <MapPin size={32} color="hsl(var(--muted-foreground))" />
                            <Text className="text-muted-foreground mt-2">Klike pou chwazi kote a</Text>
                        </Pressable>

                        {reportData.address ? (
                            <View className="flex-row items-center p-3 bg-muted rounded-lg mb-4">
                                <MapPin size={16} color="hsl(var(--accent))" className="mr-2" />
                                <Text className="text-sm text-foreground">{reportData.address}</Text>
                            </View>
                        ) : null}

                        <Pressable
                            className="w-full py-3 border border-border rounded-xl flex-row items-center justify-center"
                            onPress={handleUseMyLocation}
                        >
                            <Crosshair size={16} color="hsl(var(--foreground))" className="mr-2" />
                            <Text className="text-foreground font-medium">Itilize pozisyon mwen</Text>
                        </Pressable>
                    </View>
                )}

                {/* Step 2: Incident Type */}
                {currentStep === 2 && (
                    <View className="space-y-4">
                        <Text className="text-sm text-muted-foreground mb-4">
                            Chwazi tip ensidan an
                        </Text>
                        <IncidentTypeGrid
                            selectedType={reportData.incidentType}
                            onSelect={(type) => setReportData({ ...reportData, incidentType: type })}
                        />
                    </View>
                )}

                {/* Step 3: Details */}
                {currentStep === 3 && (
                    <View className="space-y-6">
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-foreground mb-2">Deskripsyon</Text>
                            <TextInput
                                placeholder="Dekri sa ou wè oswa sa ki pase..."
                                placeholderTextColor="hsl(var(--muted-foreground))"
                                value={reportData.description}
                                onChangeText={(text) => setReportData({ ...reportData, description: text })}
                                className="min-h-[120px] p-4 bg-background border border-border rounded-xl text-foreground"
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-foreground mb-2">Foto (opsyonèl)</Text>
                            <View className="flex-row flex-wrap gap-2">
                                <Pressable
                                    onPress={handlePhotoUpload}
                                    className="items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-lg mr-2"
                                >
                                    <Camera size={24} color="hsl(var(--muted-foreground))" />
                                </Pressable>
                                {/* Normally map photos here, but skipping for simple mock */}
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between p-4 bg-muted rounded-xl mb-6">
                            <View>
                                <Text className="text-sm font-medium text-foreground">Rapòte anonimman</Text>
                                <Text className="text-xs text-muted-foreground">Non ou pap parèt</Text>
                            </View>
                            <Switch
                                value={reportData.isAnonymous}
                                onValueChange={(checked) => setReportData({ ...reportData, isAnonymous: checked })}
                                trackColor={{ false: 'hsl(var(--border))', true: 'hsl(var(--accent))' }}
                            />
                        </View>

                        <View>
                            <Text className="text-sm font-medium text-foreground mb-2">Nivo gravite</Text>
                            <View className="flex-row gap-2">
                                {severityOptions.map((option) => (
                                    <Pressable
                                        key={option.id}
                                        onPress={() => setReportData({ ...reportData, severity: option.id })}
                                        className={cn(
                                            'flex-1 py-3 px-4 rounded-xl items-center',
                                            reportData.severity === option.id
                                                ? 'bg-accent'
                                                : 'bg-muted'
                                        )}
                                    >
                                        <Text className={cn("text-sm font-medium", reportData.severity === option.id ? "text-white" : "text-muted-foreground")}>
                                            {option.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                    <View className="space-y-4">
                        <Text className="text-sm text-muted-foreground mb-4">
                            Revize enfòmasyon yo anvan ou soumèt
                        </Text>

                        <View className="bg-card border border-border rounded-xl p-4">
                            <View className="flex-row items-start mb-4">
                                <MapPin size={20} color="hsl(var(--accent))" className="mt-0.5 mr-3" />
                                <View className="flex-1">
                                    <Text className="text-xs text-muted-foreground">Kote</Text>
                                    <Text className="text-sm font-medium text-foreground mt-1">{reportData.address}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start mb-4">
                                <View className="w-5 h-5 items-center justify-center mr-3 mt-0.5">
                                    <Text className="text-accent font-bold">!</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-muted-foreground">Tip</Text>
                                    <Text className="text-sm font-medium text-foreground mt-1 capitalize">{reportData.incidentType}</Text>
                                </View>
                            </View>

                            <View className="mb-4 ml-8">
                                <Text className="text-xs text-muted-foreground mb-1">Deskripsyon</Text>
                                <Text className="text-sm text-foreground">{reportData.description}</Text>
                            </View>

                            <View className="flex-row items-center justify-between mt-4 border-t border-border pt-4 mb-2 ml-8">
                                <Text className="text-sm text-muted-foreground">Anonim</Text>
                                <Text className="text-sm font-medium text-foreground">
                                    {reportData.isAnonymous ? 'Wi' : 'Non'}
                                </Text>
                            </View>

                            <View className="flex-row items-center justify-between ml-8">
                                <Text className="text-sm text-muted-foreground">Gravite</Text>
                                <Text className="text-sm font-medium text-foreground capitalize">
                                    {severityOptions.find(s => s.id === reportData.severity)?.label}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer Actions */}
            <View
                className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border"
                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
                <View className="flex-row gap-3 w-full max-w-lg mx-auto">
                    {currentStep > 1 && (
                        <Pressable
                            onPress={handleBack}
                            className="flex-1 py-3.5 border border-border rounded-xl flex-row items-center justify-center"
                        >
                            <ArrowLeft size={16} color="hsl(var(--foreground))" className="mr-2" />
                            <Text className="text-foreground font-medium">Retounen</Text>
                        </Pressable>
                    )}

                    {currentStep < steps.length ? (
                        <Pressable
                            onPress={handleNext}
                            disabled={!canProceed()}
                            className={cn(
                                "flex-1 py-3.5 rounded-xl flex-row items-center justify-center",
                                !canProceed() ? "bg-accent/50" : "bg-accent"
                            )}
                        >
                            <Text className="text-white font-medium">Kontinye</Text>
                            <ArrowRight size={16} color="white" className="ml-2" />
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-accent rounded-xl flex-row items-center justify-center"
                        >
                            <Text className="text-white font-medium">{isSubmitting ? 'Ap soumèt...' : 'Soumèt Rapò'}</Text>
                            <Check size={16} color="white" className="ml-2" />
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}
