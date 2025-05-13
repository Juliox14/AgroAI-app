// components/AccordionItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onPress: () => void;
}

const AccordionItem = ({
  title,
  children,
  expanded,
  onPress,
}: AccordionItemProps) => {
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <View className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <TouchableOpacity
        onPress={handlePress}
        className="flex-row justify-between items-center p-4 bg-gray-50"
        activeOpacity={0.7}
      >
        <Text className="font-medium text-gray-800">{title}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6b7280" 
        />
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