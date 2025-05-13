// components/BackButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // o puedes usar Ionicons
import { View } from 'react-native';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <View className="absolute top-12 left-4 z-50">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 items-center justify-center  bg-transparent "
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;