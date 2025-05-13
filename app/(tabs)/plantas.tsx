import PlantaCard from '@/components/PlantaCard';
import PlantaCardSkeleton from '@/components/Fallbacks/PlantaCardSkeleton';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Expediente } from '@/types/plantas';

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
        setExpedientes(json.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpedientes();
  }, []);

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
            {expedientes.map((item, id) => (
              <PlantaCard
                key={id}
                nombre={item.planta.name}
                nombreCientifico={item.planta.nombre_cientifico}
                uriImagen={item.planta.uri_imagen}
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
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};