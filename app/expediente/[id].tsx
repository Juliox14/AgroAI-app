import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import ExpedienteComponent from '../../components/expediente/ExpedienteComponent';
import BackButton from '@/components/BackButton';

export default function Expediente() {
    const { id } = useLocalSearchParams();
    const [expediente, setExpediente] = useState<any>(null);
    useEffect(() => {
        if (!id) return;

        const fetchExpediente = async () => {
            try {
                const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/getVistaRegistros/${id}`);
                const responseJSON = await res.json();
                console.log("Respuesta del servidor:", responseJSON.expediente[0].obtener_registros);
                setExpediente(responseJSON.expediente[0].obtener_registros);
            } catch (err) {
                console.error("Error en fetchExpediente:", err);
            }
        };

        fetchExpediente();
    }, [id]);


    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <BackButton />
            <ExpedienteComponent expediente={expediente} />
        </SafeAreaView>
    );
}