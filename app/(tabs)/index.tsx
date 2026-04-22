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
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WeatherData } from '@/components/home/WeatherCard';

export default function Index() {
  const router = useRouter();
  const { session, payload } = useAuth();

  const [locationName, setLocationName] = useState('Cargando ubicación...');

  // 1. Agregamos estados para las coordenadas
  const [latitud, setLatitud] = useState<number>();
  const [longitud, setLongitud] = useState<number>();

  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [loadingForecast, setLoading] = useState(false);

  // Obtener la ubicación del GPS
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requiere ubicación para mostrar el clima.');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

        // 2. Guardamos las coordenadas en el estado
        setLatitud(loc.coords.latitude);
        setLongitud(loc.coords.longitude);

        // Seguimos usando el reverse geocoding SOLO para la interfaz visual
        const [place] = await Location.reverseGeocodeAsync(loc.coords);
        const rawState = place.region ?? '';
        const fullState = normalizarEstado(rawState);
        const mun = place.city || place.district || place.subregion || '';

        setLocationName(`${mun || '—'}, ${fullState || '—'}`);
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
        setLocationName("Ubicación desconocida");
      }
    })();
  }, []);

  // Consumir la API
  useEffect(() => {
    // 3. Ahora dependemos de que existan las coordenadas, no el estado/municipio
    if (latitud === undefined || longitud === undefined) return;
    setLoading(true);

    (async () => {
      try {
        // Ojo: En tu backend el servicio del clima corría en el 3001, 
        // verifica si el 4001 es tu API Gateway o debes cambiarlo.
        const PUERTO = 4001;

        const resp = await axios.get(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:${PUERTO}/api/weather`, {
          // 4. Enviamos lat y lon a la API
          params: { lat: latitud, lon: longitud }
        });

        // 5. Ajusta el mapeo de los datos según lo que devuelva tu microservicio.
        // Si llamas directamente al microservicio de clima que vimos antes, 
        // la respuesta viene en resp.data.data (temperature, temp_max, etc)
        // y tendrás que mapearlo para que encaje con tu WeatherCard.

        // Ejemplo asumiendo que tu API devuelve directamente el objeto del microservicio:
        if (resp.data && resp.data.data) {
          // Aquí deberías transformar 'resp.data.data' a tu arreglo de ForecastItem[]
          // setForecast(datosTransformados);
          setForecast(resp.data.data);
        }

      } catch (err) {
        console.error("Error al cargar el clima:", err);
        Alert.alert('Error', 'No se pudo obtener el pronóstico del clima en este momento.');
      } finally {
        setLoading(false);
      }
    })();
  }, [latitud, longitud]); // 6. Actualizamos el arreglo de dependencias

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

          <ScrollView className="px-5 pt-6" showsVerticalScrollIndicator={false}>

            <WeatherCard loading={loadingForecast} data={forecast} />

            {/* Tarjeta de cámara */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 mt-2 shadow flex-row">
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
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 gap-6 shadow flex-row">
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
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 pb-0 mb-8 shadow">
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