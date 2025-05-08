import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import {
  ScrollView,
  Alert,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import LocationHeader from '@/components/home/LocationHeader';
import WeatherCard from '@/components/home/WeatherCard';
import { ForecastItem } from '@/components/home/DailyForecast';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';

const GATEWAY = 'http://192.168.100.3:3000';

export default function Index() {

  const { session } = useAuth();
  const [locationName, setLocationName] = useState('Cargando ubicación...');
  const [estado, setEstado] = useState<string>();
  const [municipio, setMunicipio] = useState<string>();
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loadingForecast, setLoading] = useState(false);

  // 1) Pedir permisos y calcular estado completo + municipio
  useEffect(() => {

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere ubicación.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const [place] = await Location.reverseGeocodeAsync(loc.coords);

      // Abreviatura → nombre completo
      const rawState = place.region ?? '';
      const fullState = normalizarEstado(rawState);

      const mun = place.city || place.district || place.subregion || '';
      setEstado(fullState);
      setMunicipio(mun);

      setLocationName(`${mun || '—'}, ${fullState || '—'}`);
    })();
  }, []);

  // 2) Cuando tengamos estado + municipio, llamar al gateway
  useEffect(() => {
    if (!estado) return;
    setLoading(true);

    (async () => {
      try {
        const resp = await axios.get<{
          success: boolean;
          data: {
            estado: string;
            municipio: string;
            pronostico: ForecastItem[];
          };
        }>(`${GATEWAY}/clima/pronostico`, {
          params: { estado, municipio }
        });

        if (!resp.data.success) {
          setForecast([]);
          Alert.alert('Error', 'Sin pronóstico disponible');
          return;
        }

        // Desestructuramos sólo el array
        const { estado: est, municipio: mun, pronostico } = resp.data.data;

        // (Opcional) Actualizar label de ubicación si cambió algo
        setLocationName(`${mun}, ${est}`);

        // Guardar el array en el estado
        setForecast(pronostico);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo obtener el pronóstico');
      } finally {
        setLoading(false);
      }
    })();
  }, [estado, municipio]);

  return (
    <>
      {session ? (
        <SafeAreaView className="flex-1 bg-gray-100">
          <LocationHeader locationName={locationName} />
          <ScrollView className="px-5 pt-6">
            {/* Tarjeta de clima */}
            <WeatherCard loading={loadingForecast} data={forecast} />

            {/* Estado del cultivo */}
            <View className="bg-white rounded-2xl p-5 mb-4 gap-6 shadow flex-row">
              <View className="flex-1">
                <Image
                  source={require('../../assets/images/planta-feliz.png')}
                  className="w-20 h-24 self-center my-2"
                />
              </View>
              <View className="items-center justify-between mb-2">
                <Text className="text-lg font-semibold mb-1 text-gray-800">
                  Estado del cultivo
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  Cultivo en buen estado
                </Text>
                <View className="flex-row items-center justify-center gap-8 mt-2">
                  <View className="items-center">
                    <Text>🌱</Text>
                    <Text className="text-sm">Tierra</Text>
                  </View>
                  <View className="items-center">
                    <Text>🪴</Text>
                    <Text className="text-sm">Planta</Text>
                  </View>
                  <View className="items-center">
                    <Text>💧</Text>
                    <Text className="text-sm">Hidratación</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Botón para NDVI */}
            <View className="bg-white rounded-2xl p-5 mb-4 shadow flex-row">
              <View className="w-4/6 justify-center mb-2">
                <Text className="text-lg font-semibold mb-1 text-gray-800">
                  Calcular índice NDVI
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Calcula el estrés hídrico, estado de tu cultivo y más con nuestra
                  cámara multiespectral potenciada con análisis de imágenes
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
          </ScrollView>
        </SafeAreaView>
      ) : (
        <Redirect href="/login" />
      )}
    </>
  );
}
