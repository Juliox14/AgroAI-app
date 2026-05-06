import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Parcela } from '@/interfaces/parcelas';
import NetInfo from '@react-native-community/netinfo';
import { obtenerParcelasDeCache, guardarParcelasEnCache } from '@/utils/db';

interface ResumenParcela extends Parcela {
  ultimo_ndvi:    number;
  progreso:       number;
  total_analisis: number;
  cargando:       boolean;
}

function interpretarNDVI(valor: number): { label: string; color: string } {
  if (valor <= 0)  return { label: 'Sin vegetación', color: '#ef4444' };
  if (valor < 0.2) return { label: 'Estrés',         color: '#f97316' };
  if (valor < 0.5) return { label: 'Moderada',       color: '#eab308' };
  return              { label: 'Saludable',           color: '#22c55e' };
}

export default function ResumenParcelas() {
  const router = useRouter();
  const { token } = useAuth();
  const [parcelas, setParcelas] = useState<ResumenParcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;

  useEffect(() => {
    if (!token) return;
    cargarParcelas();
  }, [token]);

  const cargarParcelas = async () => {
    setLoading(true);

    const red = await NetInfo.fetch();

    if (!red.isConnected) {
      const cache = obtenerParcelasDeCache();
      const base: ResumenParcela[] = cache.map((p: Parcela) => ({
        ...p, ultimo_ndvi: 0, progreso: 0, total_analisis: 0, cargando: false,
      }));
      setParcelas(base);
      setOffline(true);
      setLoading(false);
      return;
    }

    try {
      const res  = await fetch(`http://${IP}:3000/api/parcelas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!json.success) { setLoading(false); return; }

      guardarParcelasEnCache(json.data);
      setOffline(false);

      const base: ResumenParcela[] = json.data.map((p: Parcela) => ({
        ...p, ultimo_ndvi: 0, progreso: 0, total_analisis: 0, cargando: true,
      }));
      setParcelas(base);
      setLoading(false);

      await Promise.all(base.map(async (p) => {
        try {
          const r    = await fetch(`http://${IP}:3000/api/parcelas/${p.id}/estadisticas`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await r.json();
          if (data.success) {
            setParcelas(prev => prev.map(x =>
              x.id === p.id ? { ...x, ...data.data, cargando: false } : x
            ));
          }
        } catch {
          setParcelas(prev => prev.map(x =>
            x.id === p.id ? { ...x, cargando: false } : x
          ));
        }
      }));

    } catch (e) {
      const cache = obtenerParcelasDeCache();
      if (cache.length > 0) {
        const base: ResumenParcela[] = cache.map((p: Parcela) => ({
          ...p, ultimo_ndvi: 0, progreso: 0, total_analisis: 0, cargando: false,
        }));
        setParcelas(base);
        setOffline(true);
      }
      console.error('Error cargando parcelas:', e);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700 items-center py-8"
        style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  if (parcelas.length === 0) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700 items-center py-8"
        style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}>
        <Ionicons name="leaf-outline" size={36} color="#d1d5db" />
        <Text className="text-gray-400 mt-2 text-sm text-center">
          {offline ? 'Sin parcelas en caché local' : 'Aún no tienes parcelas registradas'}
        </Text>
        {!offline && (
          <TouchableOpacity
            onPress={() => router.push('/parcelas/nueva-parcela')}
            className="mt-3 bg-green-700 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold text-sm">Agregar parcela</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold text-gray-700 dark:text-gray-200">
          Tus parcelas
        </Text>
        {offline && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="cloud-offline-outline" size={12} color="#B45309" />
            <Text className="text-xs text-amber-600 dark:text-amber-400 font-medium">Sin internet</Text>
          </View>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {parcelas.map((p) => {
          const interp = interpretarNDVI(p.ultimo_ndvi);
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => router.push({ pathname: '/parcela/[id]', params: { id: p.id } })}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 mr-3 border border-gray-100 dark:border-gray-700"
              style={{ width: 160, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View style={{ backgroundColor: interp.color + '20' }} className="px-2 py-0.5 rounded-full">
                  <Text style={{ color: interp.color }} className="text-xs font-semibold">
                    {interp.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
              </View>

              <Text className="text-gray-800 dark:text-gray-100 font-bold text-sm mb-1" numberOfLines={1}>
                {p.nombre}
              </Text>
              <Text className="text-gray-400 text-xs mb-3" numberOfLines={1}>
                {p.tipo_sistema}
              </Text>

              {p.cargando ? (
                <ActivityIndicator size="small" color="#16a34a" />
              ) : offline ? (
                <Text className="text-gray-400 text-xs">Estadísticas sin conexión</Text>
              ) : (
                <>
                  <Text style={{ color: interp.color }} className="text-2xl font-bold">
                    {p.total_analisis === 0 ? '—' : p.ultimo_ndvi.toFixed(2)}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-gray-400 text-xs">NDVI</Text>
                    {p.total_analisis > 0 && p.progreso !== 0 && (
                      <View className="flex-row items-center gap-0.5">
                        <Ionicons
                          name={p.progreso > 0 ? 'trending-up' : 'trending-down'}
                          size={12}
                          color={p.progreso > 0 ? '#22c55e' : '#ef4444'}
                        />
                        <Text style={{ color: p.progreso > 0 ? '#22c55e' : '#ef4444' }}
                          className="text-xs font-semibold">
                          {p.progreso > 0 ? '+' : ''}{p.progreso}%
                        </Text>
                      </View>
                    )}
                  </View>
                  {p.total_analisis === 0 && (
                    <Text className="text-gray-400 text-xs mt-1">Sin análisis aún</Text>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
