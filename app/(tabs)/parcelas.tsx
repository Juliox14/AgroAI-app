import ParcelaCard from '@/components/ParcelaCard';
import ParcelaCardSkeleton from '@/components/Fallbacks/ParcelaCardSkeleton';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Parcela } from '@/interfaces/parcelas';
import { Ionicons } from '@expo/vector-icons';

export default function Parcelas() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);

  const { payload, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success) {
          setParcelas(json.data);
        } else {
          console.error('Error del servidor:', json.message);
        }
      } catch (error) {
        console.error('Error al cargar parcelas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (payload) fetchParcelas();
  }, [payload]);

  const handleAddParcela = () => router.push('/parcelas/nueva-parcela');

  if (!parcelas && !loading) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">

      {/* ── Header ── */}
      <View className="px-5 pt-4 pb-4 bg-white dark:bg-gray-900 border-b border-green-100 dark:border-gray-800 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-green-950 dark:text-gray-100 tracking-tight">Mis Parcelas</Text>
            <Text className="text-xs font-medium text-green-400 dark:text-green-300 mt-0.5">
              {!loading && `${parcelas.length} terreno${parcelas.length !== 1 ? 's' : ''} registrado${parcelas.length !== 1 ? 's' : ''}`}
            </Text>
          </View>

          {/* Botón añadir — visible siempre en el header */}
          <TouchableOpacity
            onPress={handleAddParcela}
            className="flex-row items-center bg-green-700 dark:bg-green-600 px-4 py-2.5 rounded-xl"
            activeOpacity={0.8}
            style={{ shadowColor: '#14532D', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 }}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white font-semibold text-sm ml-1">Nueva</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>

        {loading ? (
          <View key="loading" className="gap-4">
            {[...Array(3)].map((_, i) => (
              <ParcelaCardSkeleton key={`skeleton-${i}`} />
            ))}
          </View>
        ) : parcelas.length === 0 ? (

          /* ── Empty state ── */
          <View key="empty" className="items-center justify-center mt-16 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-green-100 dark:border-gray-700 shadow-sm">
            <View className="w-20 h-20 rounded-full bg-green-50 dark:bg-gray-700 items-center justify-center mb-5">
              <Ionicons name="map-outline" size={40} color="#86EFAC" />
            </View>
            <Text className="text-xl font-bold text-green-950 dark:text-gray-100 mb-2 text-center">
              Sin terrenos aún
            </Text>
            <Text className="text-sm text-gray-400 dark:text-gray-300 text-center leading-5 mb-8">
              Registra tu primera milpa o parcela para comenzar a monitorear su salud.
            </Text>
            <TouchableOpacity
              onPress={handleAddParcela}
              className="flex-row items-center bg-green-700 px-8 py-3.5 rounded-2xl"
              activeOpacity={0.85}
              style={{ shadowColor: '#14532D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 }}
            >
              <View className="w-7 h-7 rounded-lg bg-white/20 items-center justify-center mr-2">
                <Ionicons name="add" size={18} color="white" />
              </View>
              <Text className="text-white font-bold text-base">Registrar Parcela</Text>
            </TouchableOpacity>
          </View>

        ) : (

          /* ── Lista de parcelas ── */
          <View key="list" className="gap-4 pb-10">
            {parcelas.map((item) => (
              <ParcelaCard
                key={item.id}
                parcela={item}
                uriImagen={item.imagen_url ? item.imagen_url : undefined}
                handleAction={() => router.push({
                  pathname: '../parcela/[id]',
                  params: { id: item.id },
                })}
              />
            ))}

            {/* Botón añadir al final de la lista */}
            <TouchableOpacity
              onPress={handleAddParcela}
              className="flex-row items-center justify-center border-2 border-dashed border-green-200 dark:border-gray-700 rounded-2xl py-4 bg-green-50 dark:bg-gray-800"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color="#86EFAC" />
              <Text className="text-green-400 font-semibold text-sm ml-2">Agregar otra parcela</Text>
            </TouchableOpacity>
          </View>

        )}
      </ScrollView>
    </SafeAreaView>
  );
}