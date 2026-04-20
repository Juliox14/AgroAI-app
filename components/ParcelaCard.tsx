import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Parcela } from "@/interfaces/parcelas";


export interface ParcelaCardProps {
    parcela: Parcela;
    saludPromedio?: number;
    estres?: number;
    humedad?: number;
    anomalias?: number;
    uriImagen?: string;
    handleAction: () => void;
}

const ParcelaCard = ({ 
    parcela, 
    saludPromedio = 80, 
    estres = 15, 
    humedad = 60, 
    anomalias = 5, 
    uriImagen, 
    handleAction 
}: ParcelaCardProps) => {
    return (
        <TouchableOpacity onPress={handleAction} className="mb-4 px-6 py-4 rounded-xl bg-white shadow-md h-auto w-full justify-center items-center">
            <View className="flex-row w-full px-4 py-2 pb-4 border-b border-b-gray-400">
                <Image 
                    source={uriImagen ? { uri: uriImagen } : require("@/assets/images/aloe.png")} 
                    className="w-20 h-20 mr-4 rounded-full border border-gray-400" 
                />
                <View className="flex-1 justify-center">
                    {/* Nombre de la Parcela (ej. "Milpa del Río") */}
                    <Text className="text-lg font-semibold mb-1 mt-4 text-gray-800">
                        {parcela.nombre}
                    </Text>
                    {/* Reemplazamos Nombre Científico por Sistema y Ubicación */}
                    <Text className="text-sm text-gray-600 mb-4 ">
                        {parcela.tipo_sistema} • {parcela.comunidad_ejido || "Sin ubicación"}
                    </Text>
                </View>
            </View>

            {/* Panel de Estadísticas del Terreno */}
            <View className="flex-row items-center flex-wrap gap-y-2 w-full mt-4 justify-between mb-2 px-2">
                
                {/* Salud Promedio (Basado en NDVI) */}
                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="leaf-sharp" size={24} color="#15803d" />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${saludPromedio}%` }}
                            className="h-1 bg-green-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {saludPromedio}%
                    </Text>
                </View>

                {/* Nivel de Estrés / Riego */}
                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="water-sharp" size={24} color="#0369a1" />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${estres}%` }}
                            className="h-1 bg-blue-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {estres}%
                    </Text>
                </View>

                {/* Humedad del Suelo */}
                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="earth-sharp" size={24} color="#a16207" />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${humedad}%` }}
                            className="h-1 bg-yellow-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {humedad}%
                    </Text>
                </View>

                {/* Anomalías Detectadas */}
                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="sunny-sharp" size={24} color="#b91c1c" />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${anomalias}%` }}
                            className="h-1 bg-red-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {anomalias}%
                    </Text>
                </View>

            </View>
        </TouchableOpacity>
    );
};

export default ParcelaCard;