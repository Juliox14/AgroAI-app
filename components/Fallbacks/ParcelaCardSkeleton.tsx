import React from 'react';
import { View } from 'react-native';

const ParcelaCardSkeleton = () => {
  return (
    <View className="mb-4 px-6 py-4 rounded-xl bg-white shadow-md h-auto w-full justify-center items-center">
      {/* Cabecera (Imagen y Textos) */}
      <View className="flex-row w-full px-4 py-2 pb-4 border-b border-b-gray-200">
        {/* Imagen simulada */}
        <View className="w-20 h-20 mr-4 rounded-full bg-gray-200 animate-pulse" />
        
        {/* Textos simulados (Nombre y Ubicación/Sistema) */}
        <View className="flex-1 justify-center mt-4 mb-4">
          <View className="h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse" />
          <View className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </View>
      </View>
      
      {/* Indicadores (Sensores / NDVI) */}
      {/* Cambiamos el px-6 a px-2 para que coincida exactamente con ParcelaCard */}
      <View className="flex-row items-center flex-wrap gap-y-2 w-full mt-4 justify-between mb-2 px-2">
        {[...Array(4)].map((_, index) => (
          <View key={index} className="flex-row items-center justify-center gap-2 mt-2">
            {/* Ícono simulado */}
            <View className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
            {/* Barra de progreso simulada */}
            <View className="w-16 h-1 bg-gray-200 rounded-full animate-pulse" />
            {/* Porcentaje simulado */}
            <View className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ParcelaCardSkeleton;