import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { Parcela } from '@/interfaces/parcelas';
import { useAuth } from '@/context/AuthContext';

interface StatsData {
  historial: { valor: number; fecha: string }[];
  ultimo_ndvi: number;
  progreso: number;
  total_analisis: number;
}

export default function Estadisticas() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [selectedParcelaId, setSelectedParcelaId] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingParcelas, setLoadingParcelas] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchParcelas();
    }
  }, [token]);

  useEffect(() => {
    if (selectedParcelaId && token) {
      fetchStats(selectedParcelaId);
    }
  }, [selectedParcelaId]);

  const fetchParcelas = async () => {
    try {
      setLoadingParcelas(true);
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setParcelas(data.data);
        setSelectedParcelaId(data.data[0].id); // Selecciona la primera por defecto
      }
    } catch (error) {
      console.error('Error al cargar parcelas:', error);
    } finally {
      setLoadingParcelas(false);
    }
  };

  const fetchStats = async (id: string) => {
    try {
      setLoadingStats(true);
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas/${id}/estadisticas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const obtenerColorProgreso = (progreso: number) => {
    if (progreso > 0) return 'text-green-500';
    if (progreso < 0) return 'text-red-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  const chartData = stats?.historial.map(item => ({
    value: item.valor,
    label: new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  })) || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-white dark:bg-gray-900 border-b border-green-100 dark:border-gray-800 shadow-sm">
        <Text className="text-2xl font-bold text-green-950 dark:text-gray-100 tracking-tight">Estadísticas</Text>
        <Text className="text-xs font-medium text-green-400 dark:text-green-300 mt-0.5">
          Rendimiento y evolución de tus parcelas
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Selector de Parcelas */}
        <View className="py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
            {loadingParcelas ? (
              <ActivityIndicator color="#4aad8e" />
            ) : parcelas.length === 0 ? (
              <Text className="text-gray-500 dark:text-gray-400 italic">No hay parcelas registradas.</Text>
            ) : (
              parcelas.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedParcelaId(p.id)}
                  className={`mr-3 px-4 py-2 rounded-full border ${
                    selectedParcelaId === p.id 
                      ? 'bg-green-600 border-green-600' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedParcelaId === p.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {p.nombre}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Contenido Analítico */}
        <View className="px-5 pb-10">
          {loadingStats ? (
            <View className="mt-10 items-center">
              <ActivityIndicator size="large" color="#4aad8e" />
              <Text className="text-gray-500 dark:text-gray-400 mt-4">Analizando datos forenses...</Text>
            </View>
          ) : stats ? (
            <>
              {/* Tarjetas KPI */}
              <View className="flex-row justify-between mb-6">
                <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm w-[48%] border border-gray-100 dark:border-gray-700">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="leaf" size={16} color="#22c55e" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">Último NDVI</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.ultimo_ndvi.toFixed(2)}</Text>
                  <Text className="text-xs text-gray-400 mt-1">Salud actual</Text>
                </View>

                <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm w-[48%] border border-gray-100 dark:border-gray-700">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="trending-up" size={16} color="#3b82f6" />
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">Evolución</Text>
                  </View>
                  <Text className={`text-2xl font-bold ${obtenerColorProgreso(stats.progreso)}`}>
                    {stats.progreso > 0 ? '+' : ''}{stats.progreso}%
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">vs análisis anterior</Text>
                </View>
              </View>

              {/* Gráfica Principal */}
              <View className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Progreso de Salud (NDVI)</Text>
                
                {chartData.length > 0 ? (
                  <View className="items-center mt-2">
                    <LineChart
                      data={chartData}
                      width={280}
                      height={180}
                      thickness={3}
                      color="#22c55e"
                      startFillColor="rgba(34, 197, 94, 0.3)"
                      endFillColor="rgba(34, 197, 94, 0.01)"
                      startOpacity={0.9}
                      endOpacity={0.2}
                      initialSpacing={10}
                      noOfSections={5}
                      maxValue={1}
                      yAxisColor="lightgray"
                      xAxisColor="lightgray"
                      yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
                      xAxisLabelTextStyle={{ color: 'gray', fontSize: 10 }}
                      dataPointsColor="#16a34a"
                      curved
                      areaChart
                      hideRules
                      isAnimated
                    />
                  </View>
                ) : (
                  <View className="h-40 items-center justify-center">
                    <Ionicons name="bar-chart-outline" size={40} color="#d1d5db" />
                    <Text className="text-gray-400 mt-2 text-center">No hay suficientes escaneos{"\n"}para generar la gráfica.</Text>
                  </View>
                )}
              </View>

              {/* Tarjeta Extra: Total de Escaneos */}
              <View className="bg-green-50 dark:bg-green-900/30 p-4 rounded-2xl flex-row items-center justify-between border border-green-100 dark:border-green-900/50">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-800 items-center justify-center mr-3">
                    <Ionicons name="camera-outline" size={20} color="#166534" />
                  </View>
                  <View>
                    <Text className="text-sm font-bold text-green-900 dark:text-green-100">Total de Análisis Forenses</Text>
                    <Text className="text-xs text-green-700 dark:text-green-300">Registros guardados en esta parcela</Text>
                  </View>
                </View>
                <Text className="text-2xl font-bold text-green-800 dark:text-green-400">{stats.total_analisis}</Text>
              </View>

            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
