import { ScrollView, Pressable, View, Text } from 'react-native';
import { cn } from '../lib/utils';

interface FilterChip {
    id: string;
    label: string;
    color?: string;
}

interface FilterChipsProps {
    chips: FilterChip[];
    activeChip: string;
    onSelect: (id: string) => void;
    className?: string;
}

export function FilterChips({ chips, activeChip, onSelect, className }: FilterChipsProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={cn('flex-row pb-2', className)}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
            {chips.map((chip) => {
                const isActive = activeChip === chip.id;
                return (
                    <Pressable
                        key={chip.id}
                        onPress={() => onSelect(chip.id)}
                        className={cn(
                            'flex-row items-center justify-center px-4 py-2 rounded-full border',
                            isActive
                                ? 'bg-accent border-accent shadow-md'
                                : 'bg-card border-border'
                        )}
                    >
                        {chip.color && (
                            <View
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: chip.color }}
                            />
                        )}
                        <Text className={cn("text-sm font-medium", isActive ? "text-accent-foreground" : "text-foreground")}>
                            {chip.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}
