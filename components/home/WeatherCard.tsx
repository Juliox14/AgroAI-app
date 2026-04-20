// components/WeatherCard.tsx
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DailyForecast from './DailyForecast'; // Oculto temporalmente

// 1. Definimos la nueva interfaz según lo que devuelve tu backend
export interface WeatherData {
    temperature: number;
    wind_speed: number;
    time: string;
    precipitation: number;
    temp_max: number;
    temp_min: number;
}

interface Props {
    loading: boolean;
    data: WeatherData | null; // Ahora es un solo objeto o null
}

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
        </View>
    );
};

export default function WeatherCard({ loading, data }: Props) {
    // const [showDetails, setShowDetails] = useState(false);

    // Evaluamos si data es null en lugar de data.length
    if (loading || !data) {
        return <SkeletonLoader />;
    }

    // 2. Lógica simple para el emoji (al no tener la propiedad 'desciel')
    // Si hay lluvia mayor a 0, mostramos lluvia, si no, sol.
    const emoji = data.precipitation > 0 ? '🌧️' : '☀️';

    // const toggleDetails = () => {
    //     setShowDetails(!showDetails);
    // };

    return (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-semibold text-gray-800">
                        Clima Actual
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                        Hoy, {new Date().toLocaleDateString('es-MX', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </Text>
                    <View className="flex-row items-baseline">
                        {/* Ahora destacamos la temperatura actual del sensor */}
                        <Text className="text-5xl font-bold text-gray-900">
                            {data.temperature}°
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-600 mt-1">
                        Máx: {data.temp_max}° / Mín: {data.temp_min}°
                    </Text>
                </View>
                <Text className="items-center mt-4 ">
                    <Text className="text-6xl">{emoji}</Text>
                </Text>
            </View>

            {/* Reducimos los detalles solo a Viento y Lluvia que son los que devuelve el API */}
            <View className="flex-row justify-around mt-6 animate-fade-in border-t border-gray-100 pt-4">
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Lluvia</Text>
                    <Text className="text-sm">🌧️ {data.precipitation} mm</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xs text-gray-600">Viento</Text>
                    <Text className="text-sm">🌬️ {data.wind_speed} km/h</Text>
                </View>
            </View>
            
            {/* NOTA: El botón colapsable para <DailyForecast /> está comentado.
               Si en el futuro modificas el controlador de tu backend para que
               Open-Meteo te devuelva también un arreglo de días futuros, 
               puedes descomentar esta sección y pasarle ese arreglo.
            */}

        </View>
    );
}