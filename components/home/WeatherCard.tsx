// components/WeatherCard.tsx
import { View, Text } from 'react-native';

export interface WeatherData {
    temperature: number;
    wind_speed:  number;
    time:        string;
    precipitation: number;
    temp_max:    number;
    temp_min:    number;
}

interface Props {
    loading: boolean;
    data:    WeatherData | null;
}

const SkeletonLoader = () => (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow">
        <View className="flex-row justify-between items-center">
            <View>
                <View className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <View className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <View className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <View className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
            </View>
            <View className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </View>
        <View className="flex-row justify-around mt-4">
            {[...Array(2)].map((_, i) => (
                <View key={i} className="items-center">
                    <View className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                    <View className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </View>
            ))}
        </View>
    </View>
);

export default function WeatherCard({ loading, data }: Props) {
    if (loading || !data) return <SkeletonLoader />;

    const emoji = data.precipitation > 0 ? '🌧️' : '☀️';

    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Clima Actual
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Hoy, {new Date().toLocaleDateString('es-MX', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                            {data.temperature}°
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Máx: {data.temp_max}° / Mín: {data.temp_min}°
                    </Text>
                </View>
                <Text className="text-6xl">{emoji}</Text>
            </View>

            <View className="flex-row justify-around mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                <View className="items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Lluvia</Text>
                    <Text className="text-sm text-gray-800 dark:text-gray-200">🌧️ {data.precipitation} mm</Text>
                </View>
                <View className="items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Viento</Text>
                    <Text className="text-sm text-gray-800 dark:text-gray-200">🌬️ {data.wind_speed} km/h</Text>
                </View>
            </View>
        </View>
    );
}