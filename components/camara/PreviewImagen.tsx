import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    titulo: string;
    uri: string | null;
    onCancel: () => void;
}

const PreviewImagen = ({ titulo, uri, onCancel }: Props) => {
    return (
        <View className="gap-2 items-center relative">
            {uri && (
                <TouchableOpacity
                    className="absolute -top-2 -right-2 z-10 bg-red-500 rounded-full p-1"
                    onPress={onCancel}
                >
                    <Ionicons name="close" size={14} color="white" />
                </TouchableOpacity>
            )}

            {uri ? (
                <Image
                    source={{ uri }}
                    className="w-16 h-16 rounded-md"
                />
            ) : (
                <View className="w-16 h-16 rounded-md bg-gray-100/70" />
            )}

            <Text className="text-white text-center text-xs">{titulo}</Text>
        </View>
    );
}

export default PreviewImagen;
