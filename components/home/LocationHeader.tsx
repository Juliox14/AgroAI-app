// components/LocationHeader.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useColorScheme } from 'nativewind';

interface Props {
  locationName: string;
}

export default function LocationHeader({ locationName }: Props) {
  const { colorScheme } = useColorScheme();
  return (
    <View className="flex-row items-center justify-between mb-6 px-5">
      <Image
        source={
          colorScheme === 'dark'
            ? require('../../assets/images/AgroAI-letters-dark.png')
            : require('../../assets/images/AgroAI-letters.png')
        }
        className="h-14 w-32"
        resizeMode="contain"
      />
      <Text className="text-sm dark:text-white text-gray-600">{locationName}</Text>
    </View>
  );
}
