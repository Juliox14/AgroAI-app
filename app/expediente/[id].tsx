import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, SafeAreaView } from 'react-native';

export default function Expediente() {
    const { id } = useLocalSearchParams();
    const [expediente, setExpediente] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpediente = async () => {
            try {
                const res = await fetch(`http://localhost:3004/database/get/${id}`);
                const json = await res.json();
                setExpediente(json[0].obtener_expediente);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpediente();
    }, [id]);

    if (loading) return <ActivityIndicator className="mt-10" size="large" color="#00cc99" />;

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4">
            
        </SafeAreaView>
    );
}