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
import NetInfo from '@react-native-community/netinfo';
import LocationHeader from '@/components/home/LocationHeader';
import WeatherCard from '@/components/home/WeatherCard';
import ResumenParcelas from '@/components/home/ResumenParcelas';
import ConsejoDelDia from '@/components/home/ConsejoDelDia';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WeatherData } from '@/components/home/WeatherCard';

export default function Index() {
  const router = useRouter();
  const { session, payload } = useAuth();

  const [locationName, setLocationName] = useState('Cargando ubicación...');
  const [latitud, setLatitud] = useState<number>();
  const [longitud, setLongitud] = useState<number>();
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [loadingForecast, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere ubicación para mostrar el clima.');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLatitud(loc.coords.latitude);
        setLongitud(loc.coords.longitude);

        const [place] = await Location.reverseGeocodeAsync(loc.coords);
        const rawState = place.region ?? '';
        const fullState = normalizarEstado(rawState);
        const mun = place.city || place.district || place.subregion || '';
        setLocationName(`${mun || '—'}, ${fullState || '—'}`);
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
        setLocationName('Ubicación desconocida');
      }
    })();
  }, []);

  useEffect(() => {
    if (latitud === undefined || longitud === undefined) return;

    (async () => {
      const red = await NetInfo.fetch();
      if (!red.isConnected) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const resp = await axios.get(
          `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:4001/api/weather`,
          { params: { lat: latitud, lon: longitud } }
        );
        if (resp.data?.data) setForecast(resp.data.data);
      } catch (err: any) {
        console.error("Error al cargar el clima:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [latitud, longitud]);

  return (
    <>
      {session ? (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">

          <LocationHeader locationName={locationName} />

          <View className="px-8 pt-4">
            <Text className="text-3xl font-light text-gray-600 dark:text-gray-300">
              Bienvenido, {payload?.nombre ? payload.nombre.split(' ')[0] : 'Productor'}!
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }} showsVerticalScrollIndicator={false}>

            <WeatherCard loading={loadingForecast} data={forecast} />

            <ConsejoDelDia clima={forecast} />

            <ResumenParcelas />

            {/* Tarjeta de cámara */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 mt-2 border border-gray-100 dark:border-gray-700 flex-row" style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}>
              <View className="w-4/6 justify-center mb-2">
                <Text className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
                  Calcular índice NDVI
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Calcula la salud de tu cultivo convirtiendo este dispositivo
                  en un centro de control multiespectral.
                </Text>
                <TouchableOpacity
                  className="bg-green-700 px-4 py-2 rounded-xl self-start items-center justify-center flex-row"
                  onPress={() => router.push('/(tabs)/camara')}
                >
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
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 gap-6 border border-gray-100 dark:border-gray-700 flex-row" style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}>
              <View className="flex-1 justify-center">
                <Image
                  source={require('../../assets/images/sensor.png')}
                  className="w-24 h-24 self-center my-2"
                />
              </View>
              <View className="w-4/6 justify-center mb-2">
                <Text className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
                  Humedad del suelo
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Monitorea el estado de la tierra en tiempo real
                  y recibe alertas cuando tu parcela necesite riego.
                </Text>
                <TouchableOpacity
                  className="bg-green-700 px-4 py-2 rounded-xl self-start items-center justify-center flex-row"
                  onPress={() => router.push('/(tabs)/tierra')}
                >
                  <Ionicons name="thermometer-outline" size={24} color="white" />
                  <Text className="text-white font-semibold ml-2">Ver sensores</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Información sobre NDVI */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 pb-0 mb-8 border border-gray-100 dark:border-gray-700" style={{ elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}>
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Conoce más sobre el NDVI
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                El Índice de Vegetación de Diferencia Normalizada (NDVI) es una métrica
                que revela la salud de las plantas comparando la luz visible e
                infrarroja. Valores cercanos a 1 indican vegetación sana.
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Nuestro sistema marca zonas de estrés y anomalías para que puedas tomar
                decisiones informadas sobre tu milpa.
              </Text>
              <Image
                source={require('../../assets/images/ndvi_explicado.png')}
                className="w-full h-44 self-center mt-4"
                resizeMode="contain"
              />
            </View>

            {/* Footer */}
            <View className="flex-row justify-center items-center mb-10 mt-2">
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