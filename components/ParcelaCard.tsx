import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Parcela } from "@/interfaces/parcelas";

export interface ParcelaCardProps {
    parcela: Parcela;
    uriImagen?: string;
    // Agregamos estas dos propiedades reales para cuando guardes los resultados del NDVI
    ultimoNDVI?: number; 
    fechaUltimoEscaneo?: string;
    handleAction: () => void;
}

const ParcelaCard = ({ 
    parcela, 
    uriImagen, 
    ultimoNDVI,
    fechaUltimoEscaneo,
    handleAction 
}: ParcelaCardProps) => {

    // Función simple para darle color al NDVI real
    const obtenerColorNDVI = (valor?: number) => {
        if (valor === undefined) return "bg-gray-400";
        if (valor > 0.6) return "bg-green-600"; // Vegetación densa/sana
        if (valor > 0.3) return "bg-yellow-500"; // Vegetación moderada
        return "bg-red-500"; // Estrés severo o suelo desnudo
    };

    return (
        <TouchableOpacity onPress={handleAction} className="mb-4 px-4 py-4 rounded-xl bg-white shadow-md h-auto w-full">
            {/* Cabecera: Imagen, Nombre y Ubicación */}
            <View className="flex-row w-full pb-4 border-b border-b-gray-200 items-center">
                <Image 
                    source={uriImagen ? { uri: uriImagen } : require("@/assets/images/aloe.png")} 
                    className="w-16 h-16 mr-4 rounded-lg border border-gray-300" 
                    resizeMode="cover"
                />
                <View className="flex-1 justify-center">
                    <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                        {parcela.nombre}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1" numberOfLines={1}>
                        {parcela.tipo_sistema} • {parcela.comunidad_ejido || "Sin ubicación"}
                    </Text>
                </View>
            </View>

            {/* Fila de Datos Duros (Lo que realmente sabemos de la base de datos) */}
            <View className="flex-row flex-wrap mt-3 gap-2">
                {/* Cultivos */}
                <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-md">
                    <Ionicons name="leaf-outline" size={14} color="#15803d" />
                    <Text className="text-xs text-green-800 ml-1 font-medium" numberOfLines={1} style={{ maxWidth: 100 }}>
                        {parcela.cultivos_asociados || "Sin registro"}
                    </Text>
                </View>

                {/* Tipo de Riego */}
                <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded-md">
                    <Ionicons name="water-outline" size={14} color="#0369a1" />
                    <Text className="text-xs text-blue-800 ml-1 font-medium">
                        {parcela.tipo_riego || "N/A"}
                    </Text>
                </View>

                {/* Área */}
                {parcela.area_metros_cuadrados && (
                    <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-md">
                        <Ionicons name="scan-outline" size={14} color="#b45309" />
                        <Text className="text-xs text-amber-800 ml-1 font-medium">
                            {parcela.area_metros_cuadrados} m²
                        </Text>
                    </View>
                )}
            </View>

            {/* El único indicador analítico real: NDVI */}
            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-t-gray-100">
                <Text className="text-sm text-gray-500 font-medium">
                    Último análisis NDVI:
                </Text>
                {ultimoNDVI !== undefined ? (
                    <View className="flex-row items-center">
                        <View className={`w-3 h-3 rounded-full ${obtenerColorNDVI(ultimoNDVI)} mr-2`} />
                        <Text className="text-sm font-bold text-gray-700">{ultimoNDVI.toFixed(2)}</Text>
                        <Text className="text-xs text-gray-400 ml-2">({fechaUltimoEscaneo})</Text>
                    </View>
                ) : (
                    <Text className="text-sm text-gray-400 italic">Sin escaneos</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ParcelaCard;