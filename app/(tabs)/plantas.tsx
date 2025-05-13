import PlantaCard from '@/components/PlantaCard';
import PlantaCardSkeleton from '@/components/Fallbacks/PlantaCardSkeleton';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Expediente } from '@/types/plantas';
import { Ionicons } from '@expo/vector-icons';

export default function Plantas() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);
  const { payload } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
      
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/getVistaExpedientes/${payload?.id}`);
        const json = await res.json();
        console.log("respeta desde las plantas bro: ", json.data);
        setExpedientes(json.data);
        console.log('Datos de expedientes:', json.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpedientes();
  }, []);

  useEffect(() => {
    console.log('Expedientes:', expedientes);
  }, [expedientes]);

  const handleAddPlant = () => {
    router.push('/(tabs)/camara');
  };

  if(!expedientes)
    return

  return (
    <ScrollView>
      <SafeAreaView className="flex-1 p-6">
        <Text className="text-2xl font-bold mb-4 text-center">Mis Plantas</Text>

        {loading ? (
          <View className="flex-1 gap-6 mt-4">
            {[...Array(3)].map((_, index) => (
              <PlantaCardSkeleton key={`skeleton-${index}`} />
            ))}
          </View>
        ) : (
          <View className="flex-1 gap-6 mt-4">
            {(expedientes === null || expedientes === undefined || expedientes.length === 0) ? (
              <View className="items-center justify-center mt-10">
                <Ionicons name="leaf-outline" size={60} color="#9CA3AF" className="mb-4" />
                <Text className="text-xl font-semibold text-gray-600 mb-2 text-center">
                  ¡Ups! Parece que no tienes plantas registradas
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Comienza agregando tu primera planta para monitorear su salud
                </Text>
                <TouchableOpacity
                  onPress={handleAddPlant}
                  className="flex-row items-center bg-green-600 px-6 py-3 rounded-lg"
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text className="text-white font-medium ml-2">Agregar primera planta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              expedientes.map((item, id) => (
                <PlantaCard
                  key={id}
                  nombre={item.planta.name}
                  nombreCientifico={item.planta.nombre_cientifico}
                  uriImagen={item.uri_imagen}
                  salud={item.ultimo_registro ? item.ultimo_registro.healthy : 0}
                  estres={item.ultimo_registro ? item.ultimo_registro.stressed : 0}
                  humedad={item.ultimo_registro ? item.ultimo_registro.dry : 0}
                  anomalias={item.ultimo_registro ? item.ultimo_registro.anomaly : 0}
                  handleAction={() => {
                    router.push({
                      pathname: "/expediente/[id]",
                      params: { id: item.id_expediente },
                    });
                  }}
                />
              ))
            )}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}