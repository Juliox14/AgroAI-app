import ParcelaCard from '@/components/ParcelaCard';
import ParcelaCardSkeleton from '@/components/Fallbacks/ParcelaCardSkeleton';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Parcela } from '@/interfaces/parcelas'; // Tu nueva interfaz
import { Ionicons } from '@expo/vector-icons';

export default function Parcelas() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Asumiendo que tu AuthContext te devuelve el token JWT para hacer peticiones seguras
  const { payload, token } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Inyectamos el token para pasar el verificarToken del backend
            'Authorization': `Bearer ${token}` 
          }
        });
        
        const json = await res.json();
        if (json.success) {
          setParcelas(json.data);
          console.log('Datos de parcelas:', json.data);
        } else {
          console.error('Error del servidor:', json.message);
        }
      } catch (error) {
        console.error('Error al cargar parcelas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (payload) {
      fetchParcelas();
    }
  }, [payload]);

  const handleAddParcela = () => {
    router.push('/parcelas/nueva-parcela');
  };

  if (!parcelas && !loading) return null;

  return (
    <ScrollView className="bg-gray-50">
      <SafeAreaView className="flex-1 p-6">
        <Text className="text-3xl font-bold mb-6 text-green-900 text-center">Mis Parcelas</Text>

        {loading ? (
          <View className="flex-1 gap-6 mt-4">
            {[...Array(3)].map((_, index) => (
              <ParcelaCardSkeleton key={`skeleton-${index}`} />
            ))}
          </View>
        ) : (
          <View className="flex-1 gap-6 mt-2">
            {(parcelas === null || parcelas === undefined || parcelas.length === 0) ? (
              <View className="items-center justify-center mt-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Ionicons name="map-outline" size={60} color="#9CA3AF" className="mb-4" />
                <Text className="text-xl font-semibold text-gray-700 mb-2 text-center">
                  Aún no hay terrenos registrados
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Comienza agregando tu primera milpa o parcela para llevar el registro de su salud.
                </Text>
                <TouchableOpacity
                  onPress={handleAddParcela}
                  className="flex-row items-center bg-green-700 px-6 py-3 rounded-xl shadow-sm"
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text className="text-white font-medium ml-2 text-lg">Registrar Parcela</Text>
                </TouchableOpacity>
              </View>
            ) : (
              parcelas.map((item) => (
                <ParcelaCard
                  key={item.id}
                  parcela={item}
                  // Aquí después conectaremos los datos reales de los últimos análisis NDVI
                  saludPromedio={85} 
                  estres={10}
                  humedad={60}
                  anomalias={5}
                  handleAction={() => {
                    router.push({
                      pathname: '../parcela/[id]',
                      params: { id: item.id },
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