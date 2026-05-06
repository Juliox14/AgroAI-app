// app/results/SeleccionarParcela.tsx
import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { FileSystem, File } from 'expo-file-system';

const RASPBERRY_IP = process.env.EXPO_PUBLIC_RASPBERRY_IP_ADDRESS;
const BACKEND_IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const COLORMAP_URL = `http://${RASPBERRY_IP}:5000/ndvi/colormap`;
const PARCELAS_URL = `http://${BACKEND_IP}:3000/api/parcelas`;
const GUARDAR_URL = `http://${BACKEND_IP}:3000/api/ndvi/guardar`;

export default function SeleccionarParcela() {
  const router = useRouter();
  const { token } = useAuth();

  const { ndvi_promedio, ndvi_minimo, ndvi_maximo, ndvi_mediana } =
    useLocalSearchParams<{
      ndvi_promedio: string;
      ndvi_minimo: string;
      ndvi_maximo: string;
      ndvi_mediana: string;
    }>();

  const [parcelas, setParcelas] = useState<any[]>([]);
  const [parcelaSeleccionada, setParcelaSeleccionada] = useState<string | null>(null);
  const [cargandoParcelas, setCargandoParcelas] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const res = await fetch(PARCELAS_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) setParcelas(json.data);
      } catch (e) {
        console.error('Error cargando parcelas:', e);
      } finally {
        setCargandoParcelas(false);
      }
    };
    fetchParcelas();
  }, [token]);

  const guardarRegistro = async () => {
    if (!parcelaSeleccionada) {
      Alert.alert('Selecciona una parcela', 'Debes elegir a qué parcela pertenece este análisis.');
      return;
    }

    setGuardando(true);
    try {
      // 1. Descargar la imagen usando la nueva API
      const tempFileUri = FileSystem.Paths.cache + 'ndvi_colormap_temp.jpg';
      const tempFile = new File(tempFileUri);
      await tempFile.downloadAsync(new URL(COLORMAP_URL));

      // 2. Armar el FormData
      const formData = new FormData();
      formData.append('imagen', {
        uri: tempFile.uri,
        name: 'ndvi.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('parcelaId', parcelaSeleccionada);
      formData.append('ndvi_promedio', ndvi_promedio);
      formData.append('ndvi_minimo', ndvi_minimo);
      formData.append('ndvi_maximo', ndvi_maximo);
      formData.append('ndvi_mediana', ndvi_mediana);

      // 3. Enviar al backend
      const res = await fetch(GUARDAR_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      // 4. Limpiar archivo temporal
      tempFile.delete();

      // 5. Navegar al resultado
      router.replace({
        pathname: '/resultados/NDVIResultado',
        params: {
          ndvi_promedio,
          ndvi_minimo,
          ndvi_maximo,
          ndvi_mediana,
          imagen_url: json.data.imagen_url,
        }
      });

    } catch (e: any) {
      console.error('Error guardando registro:', e);
      Alert.alert('Error', e.message ?? 'No se pudo guardar el análisis. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-green-900">¿A qué parcela pertenece?</Text>
        <Text className="text-gray-500 text-sm mt-1">
          Selecciona la parcela donde se tomó este análisis
        </Text>
      </View>

      {/* Resumen NDVI */}
      <View className="mx-6 mt-4 bg-green-50 border border-green-100 rounded-2xl p-4 flex-row justify-between">
        <View className="items-center">
          <Text className="text-green-400 text-xs">Promedio</Text>
          <Text className="text-green-800 font-bold text-lg">{parseFloat(ndvi_promedio).toFixed(3)}</Text>
        </View>
        <View className="items-center">
          <Text className="text-green-400 text-xs">Mínimo</Text>
          <Text className="text-green-800 font-bold text-lg">{parseFloat(ndvi_minimo).toFixed(3)}</Text>
        </View>
        <View className="items-center">
          <Text className="text-green-400 text-xs">Máximo</Text>
          <Text className="text-green-800 font-bold text-lg">{parseFloat(ndvi_maximo).toFixed(3)}</Text>
        </View>
        <View className="items-center">
          <Text className="text-green-400 text-xs">Mediana</Text>
          <Text className="text-green-800 font-bold text-lg">{parseFloat(ndvi_mediana).toFixed(3)}</Text>
        </View>
      </View>

      {/* Lista de parcelas */}
      {cargandoParcelas ? (
        <ActivityIndicator size="large" color="#16a34a" style={{ flex: 1 }} />
      ) : (
        <ScrollView className="flex-1 px-6 mt-4">
          {parcelas.map((parcela) => {
            const seleccionada = parcelaSeleccionada === parcela.id;
            return (
              <TouchableOpacity
                key={parcela.id}
                onPress={() => setParcelaSeleccionada(parcela.id)}
                className={`bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm border-2 ${
                  seleccionada ? 'border-green-500' : 'border-transparent'
                }`}
              >
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                  seleccionada ? 'bg-green-500' : 'bg-gray-100'
                }`}>
                  <Ionicons
                    name={seleccionada ? 'checkmark' : 'leaf-outline'}
                    size={20}
                    color={seleccionada ? 'white' : '#6b7280'}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800">{parcela.nombre}</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    {parcela.tipo_sistema} · {parcela.area_metros_cuadrados} m²
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Botón guardar */}
      <View className="px-6 pb-8 pt-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={guardarRegistro}
          disabled={guardando || !parcelaSeleccionada}
          className={`py-4 rounded-2xl items-center ${
            parcelaSeleccionada ? 'bg-green-700' : 'bg-gray-300'
          }`}
        >
          {guardando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Guardar Análisis</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}