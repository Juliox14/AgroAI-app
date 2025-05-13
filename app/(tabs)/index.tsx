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
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import LocationHeader from '@/components/home/LocationHeader';
import WeatherCard from '@/components/home/WeatherCard';
import { ForecastItem } from '@/components/home/DailyForecast';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const { session } = useAuth();
  const [locationName, setLocationName] = useState('Cargando ubicación...');
  const [estado, setEstado] = useState<string>();
  const [municipio, setMunicipio] = useState<string>();
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loadingForecast, setLoading] = useState(false);

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
        }>(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/clima/pronostico`, {
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

            {/* Tarjeta de cámara */}
            <View className="bg-white rounded-2xl p-5 mb-4 shadow flex-row">
              <View className="w-4/6 justify-center mb-2">
                <Text className="text-lg font-semibold mb-1 text-gray-800">
                  Calcular índice NDVI
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Calcula la salúd de tu cultivo con nuestro dispositivo
                  que convierte la cámara de tu smartphone en una 
                  cámara multiespectral potenciada con análisis de imágenes
                </Text>
                <TouchableOpacity className="bg-green-700 px-4 py-2 rounded-xl self-start items-center justify-center flex-row"
                  onPress={() => router.push('/camara')}>
                  <Ionicons name="camera-outline" size={24} color="white" />
                  <Text className="text-white font-semibold ml-2">Usar cámara</Text>
                </TouchableOpacity>
              </View>
              <View className="items-center justify-center flex-1">
                <Image
                  source={require('../../assets/images/ndvi.png')}
                  className="w-24 h-36 self-center"
                />
              </View>
            </View>

            {/* Estado del cultivo */}
            <View className="bg-white rounded-2xl p-5 mb-4 gap-6 shadow flex-row">
              <View className="flex-1 justify-center">
                <Image
                  source={require('../../assets/images/sensor.png')}
                  className="w-24 h-24 self-center my-2"
                />
              </View>
              <View className="w-4/6 justify-center mb-2">
                <Text className="text-lg font-semibold mb-1 text-gray-800">
                  Humedad del suelo de tu cultivo
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                  {/* Texto de el modulo para sensor de humedad */}
                  Monitorea el estado de tu cultivo en tiempo real
                  y recibir alertas cuando necesite riego.
                </Text>
                <TouchableOpacity className="bg-green-700 px-4 py-2 rounded-xl self-start items-center justify-center flex-row"
                  onPress={() => router.push('/tierra')}>
                  <Ionicons name="thermometer-outline" size={24} color="white" />
                  <Text className="text-white font-semibold ml-2">Usar sensor</Text>
                </TouchableOpacity>
              </View>
              
            </View>

            <View className="bg-white rounded-2xl p-5 pb-0 mb-4 shadow">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Conoce más sobre el NDVI
              </Text>
              <Text className="text-sm text-gray-600">
                El Índice de Vegetación de Diferencia Normalizada (NDVI) es una métrica
                que revela la salud de las plantas comparando la reflexión infrarroja e 
                infrarroja cercana. Valores cercanos a 1 indican vegetación sana, mientras
                que valores cercanos a -1 pueden señalizar agua o suelo desnudo.
              </Text>
              <Text className="text-sm text-gray-600 mt-2">
                Nuestro análisis marca zonas de estrés y anomalías para que puedas tomar
                decisiones informadas en tu cultivo.
              </Text>
              <Image
                  source={require('../../assets/images/ndvi_explicado.png')}
                  className="w-full h-44 self-center"
                />
            </View>

            

            <View className="flex-row justify-center items-center mt-6 mb-4">
              <Text className="text-xs text-gray-500 mr-2">
                Powered by WindCode
              </Text>
              <Image
                source={require('../../assets/images/windcode-logo.png')}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>

          </ScrollView>
        </SafeAreaView>
      ) : (
        <Redirect href="/login" />
      )}
    </>
  );
}
