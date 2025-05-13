// components/WeatherCard.tsx
import { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
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
    'Poco nuboso': '⛅️',
    'Cielo nublado': '☁️',
    'Medio nublado': '☁️',
    'Lluvia aislada': '🌧️',
    'Tormenta': '⛈️',
};

const SkeletonLoader = () => {
    return (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow">
            {/* Encabezado */}
            <View className="flex-row justify-between items-center">
                <View>
                    <View className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse"></View>
                    <View className="h-4 w-40 bg-gray-200 rounded mb-4 animate-pulse"></View>
                    <View className="flex-row items-baseline">
                        <View className="h-12 w-16 bg-gray-200 rounded animate-pulse"></View>
                        <View className="h-6 w-8 bg-gray-200 rounded ml-2 animate-pulse"></View>
                    </View>
                    <View className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse"></View>
                </View>
                <View className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></View>
            </View>

            {/* Detalles */}
            <View className="flex-row justify-around mt-4">
                {[...Array(2)].map((_, i) => (
                    <View key={i} className="items-center">
                        <View className="h-3 w-16 bg-gray-200 rounded mb-1 animate-pulse"></View>
                        <View className="h-4 w-12 bg-gray-200 rounded animate-pulse"></View>
                    </View>
                ))}
            </View>

            {/* Forecast */}
            <View className="mt-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[...Array(4)].map((_, i) => (
                        <View key={i} className="bg-gray-200 rounded-lg p-3 mr-3 w-24 h-32 animate-pulse"></View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};


export default function WeatherCard({ loading, data }: Props) {
    const [showDetails, setShowDetails] = useState(false);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (!data.length) {
        return <SkeletonLoader />;
    }

    const today = data[0];
    const emoji = emojiByDesc[today.desciel] || '❓';

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-semibold text-gray-800">
                        Clima
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

            {/* Botón para expandir/contraer detalles */}
            

            <View className="flex-row justify-around mt-4 animate-fade-in">
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Precipitación</Text>
                    <Text className="text-sm">☔ {today.probprec}%</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Lluvia acumulada</Text>
                    <Text className="text-sm">🌧️ {today.prec} mm</Text>
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
            
            <TouchableOpacity
                onPress={toggleDetails}
                className="flex-row items-center justify-center mt-4"
                activeOpacity={0.7}
            >
                <Text className="text-sm text-blue-500 mr-1">
                    {showDetails ? 'Ocultar pronósticos' : 'Mostrar pronóstico de 4 días'}
                </Text>
                <Ionicons
                    name={showDetails ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#3b82f6"
                />
            </TouchableOpacity>
            {/* Detalles adicionales (colapsables) */}
            {showDetails && (
                <>

                    <DailyForecast data={data} />
                </>
            )}

        </View>
    );
}