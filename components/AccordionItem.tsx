// components/AccordionItem.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
}

const AccordionItem = ({ title, children }: AccordionItemProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="flex-row justify-between items-center p-4 bg-gray-50"
            >
                <Text className="font-medium text-gray-800">{title}</Text>
                {expanded ? (
                    <Ionicons name="chevron-up" size={20} color="#6b7280" />
                ) : (
                    <Ionicons name="chevron-down" size={20} color="#6b7280" />
                )}
            </TouchableOpacity>

            {expanded && (
                <View className="p-4 bg-white">
                    {children}
                </View>
            )}
        </View>
    );
};

export default AccordionItem;