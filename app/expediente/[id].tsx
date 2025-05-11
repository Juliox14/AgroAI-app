import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, SafeAreaView } from 'react-native';

export default function Expediente() {
    const { id } = useLocalSearchParams();
    const [expediente, setExpediente] = useState<any>(null);
    // const [loading, setLoading] = useState(true);

    

    // if (loading) return <ActivityIndicator className="mt-10" size="large" color="#00cc99" />;

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold mb-4">Expediente {id}</Text>
        </SafeAreaView>
    );
}