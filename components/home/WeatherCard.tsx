// components/WeatherCard.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DailyForecast, { ForecastItem } from './DailyForecast';

interface Props {
    loading: boolean;
    data: ForecastItem[];
}



type emojiByDesc = {
    [key: string]: string;
};





const emojiByDesc: emojiByDesc = {
    'Despejado': '☀️',
    'Mayormente despejado': '🌤️',
    'Parcial nuboso': '⛅️',
    'Cielo nublado': '☁️',
    'Medio nublado': '☁️',
    'Lluvia aislada':'🌧️',
    'Tormenta': '⛈️',
};

export default function WeatherCard({ loading, data }: Props) {

    if (loading) {
        return (
            <View className="bg-white rounded-2xl p-6 mb-6 shadow items-center">
                <ActivityIndicator size="large" color="#4aad8e" />
            </View>
        );
    }
    if (!data.length) {
        return (
            <View className="bg-white rounded-2xl p-6 mb-6 shadow items-center">
                <Text className="text-gray-600">No hay datos de clima disponibles.</Text>
            </View>
        );
    }

    // Usaremos el primer elemento como "hoy"
    const today = data[0];
    const emoji = emojiByDesc[today.desciel] || '❓';

    return (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-semibold text-gray-800">
                        Clima en {today.nmun}, {today.nes}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                        Hoy, {new Date().toLocaleDateString('es-MX', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-5xl font-bold text-gray-900">
                            {today.tmax}°
                        </Text>
                        <Text className="text-xl text-gray-500 ml-2">
                            {today.tmin}°
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-600 mt-1">
                        {today.desciel}
                    </Text>
                </View>
                <Text className="items-center mt-4 ">
                    <Text className="text-6xl">{emoji}</Text>
                </Text>
            </View>

            {/* Detalles adicionales */}
            <View className="flex-row justify-around mt-4">
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Precipitación</Text>
                    <Text className="text-sm">☔ {today.probprec}%</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Lluvia acumulada</Text>
                    <Text className="text-sm">{today.prec} mm</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Viento</Text>
                    <Text className="text-sm">🌬️ {today.velvien} km/h</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Nubes</Text>
                    <Text className="text-sm">☁️ {today.cc}%</Text>
                </View>
            </View>

            {/* Forecast para varios días */}
            <DailyForecast data={data} />
        </View>
    );
}
