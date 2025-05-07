// components/LocationHeader.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';

interface Props {
  locationName: string;
}

export default function LocationHeader({ locationName }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-6 px-5">
      <Image
        source={require('../../assets/images/AgroAI-letters.png')}
        className="w-32 h-8"
      />
      <Text className="text-sm text-gray-600">{locationName}</Text>
    </View>
  );
}
