// components/BackButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

const BackButton = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <View>
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 items-center justify-center  bg-transparent "
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;