import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';

export default function DetalleParcela() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const router = useRouter();

  const [parcela, setParcela] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) setParcela(json.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />;
  if (!parcela) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Ionicons name="alert-circle-outline" size={80} color="#D1D5DB" className="mb-4" />
        <Text className="text-2xl font-bold text-gray-700 mb-2 text-center">
          Parcela no encontrada
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Hubo un problema al cargar la información de esta milpa o la conexión falló.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center bg-green-700 px-6 py-3 rounded-xl shadow-sm"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text className="text-white font-medium text-lg ml-2">Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header con botón de volver */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <BackButton />
        <Text className="text-xl font-bold ml-4 text-green-900">{parcela.nombre}</Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-4">
        {/* Card de Información General */}
        <View className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <Text className="text-gray-400 uppercase text-xs font-bold mb-2">Información de la Milpa</Text>
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-sharp" size={20} color="#15803d" />
            <Text className="ml-2 text-gray-700 text-lg">{parcela.comunidad_ejido || 'Chiapas, México'}</Text>
          </View>

          <View className="flex-row justify-between border-t border-gray-100 pt-4">
            <View>
              <Text className="text-gray-400 text-xs">Sistema</Text>
              <Text className="text-gray-800 font-medium">{parcela.tipo_sistema}</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Área</Text>
              <Text className="text-gray-800 font-medium">{parcela.area_metros_cuadrados} m²</Text>
            </View>
            <View>
              <Text className="text-gray-400 text-xs">Riego</Text>
              <Text className="text-gray-800 font-medium">{parcela.tipo_riego}</Text>
            </View>
          </View>
        </View>

        {/* Sección de Cultivos Asociados */}
        <View className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
          <Text className="text-green-800 font-bold mb-1">Cultivos en convivencia:</Text>
          <Text className="text-green-700 italic">{parcela.cultivos_asociados}</Text>
        </View>

        {/* Historial de Registros NDVI */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Historial de Salud (NDVI)</Text>

        {parcela.registros.length === 0 ? (
          <View className="items-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <Ionicons name="camera-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">Aún no hay capturas de esta parcela</Text>
          </View>
        ) : (
          parcela.registros.map((registro: any) => (
            <TouchableOpacity
              key={registro.id}
              className="bg-white rounded-2xl p-4 mb-4 flex-row items-center shadow-sm"
              onPress={() => router.push({ pathname: "/results/NDVIResult", params: { registroId: registro.id } })}
            >
              <Image
                source={{ uri: registro.s3_imagen_url }}
                className="w-16 h-16 rounded-lg bg-gray-200"
              />
              <View className="ml-4 flex-1">
                <Text className="font-bold text-gray-800">Análisis del {new Date(registro.fecha_captura).toLocaleDateString()}</Text>
                <Text className="text-green-600 font-medium">NDVI Promedio: {registro.ndvi_promedio.toFixed(2)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Botón flotante para nueva captura con la Raspberry */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/camara')}
        className="absolute bottom-10 right-6 bg-green-700 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="aperture-outline" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}