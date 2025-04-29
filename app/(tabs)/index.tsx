import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-5 pt-6">
      {/* Encabezado */}
      <View className="flex-row items-center justify-between">
        <Image source={require('../../assets/images/AgroAI-letters.png')} className='w-32 h-8' />
        <Text className="text-sm text-gray-600">Tuxtla Gutiérrez, Chiapas</Text>
      </View>

      <View className='items-center justify-center py-10'>
        <View className="bg-white rounded-2xl p-6 mb-4 shadow flex-row">
          <View className='flex-1'>
            <Text className="text-lg font-semibold mb-1 text-gray-800">Clima</Text>
            <Text className="text-sm text-gray-600 mb-2">Hoy, 05 de marzo de 2025</Text>
            <Text className="text-4xl font-bold">32°</Text>
            <View className="flex-row gap-4 mt-2">
              <View className='items-center'>
                <Text className="text-sm">14:00 </Text>
                <Text>🌤️</Text>
              </View>
              <View className='items-center'>
                <Text className="text-sm">15:00 </Text>
                <Text >☀️</Text>
              </View>
              <View className='items-center'>
                <Text className="text-sm">16:00 </Text>
                <Text>🌥️</Text>
              </View>
              <View className='items-center'>
                <Text className="text-sm">17:00 </Text>
                <Text>🌧️</Text>
              </View>

            </View>
          </View>

          <View className="items-start justify-center mr-4">
            <Ionicons name="sunny" size={96} color="#facc15" />
          </View>


        </View>

        {/* Estado del cultivo */}
        <View className="bg-white rounded-2xl p-5 mb-4 gap-6 shadow flex-row">

          <View className="flex-1">
            <Image
              source={require('../../assets/images/planta-feliz.png')}
              className="w-20 h-24 self-center my-2 "
            />
          </View>
          <View className="items-center justify-between mb-2">
            <Text className="text-lg font-semibold mb-1 text-gray-800">Estado del cultivo</Text>
            <Text className="text-sm text-gray-600 mb-2">Cultivo en buen estado</Text>
            <View className="flex-row items-center justify-center gap-8 mt-2">
              <View className='items-center'>
                <Text>🌱</Text>
                <Text className="text-sm">Tierra</Text>
              </View>
              <View className='items-center'>
                <Text>🪴</Text>
                <Text className="text-sm">Planta</Text>
              </View>
              <View className='items-center'>
                <Text>💧</Text>
                <Text className="text-sm">Hidratación</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calcular NDVI */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow flex-row">
          <View className="w-4/6 justify-center mb-2">
            <Text className="text-lg font-semibold mb-1 text-gray-800">Calcular índice NDVI</Text>
            <Text className="text-sm text-gray-600 mb-4">
            Calcula el éstres hídrico, estado de tu cultivo y más con nuestra cámara multiespectral potenciada con análisis de imágenes
            </Text>
            <TouchableOpacity className="bg-green-700 px-4 py-2 rounded-xl self-start items-center justify-center flex-row">
              <Ionicons name="camera-outline" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Usar cámara</Text>
            </TouchableOpacity>
          </View>
          <View className="items-center flex-1 w-full h-full">
            <Image
              source={require('../../assets/images/planta.png')}
              className="w-16 h-36 self-center"
            />
          </View>
        </View>
      </View>
    </SafeAreaView >
  );
}
