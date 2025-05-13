// components/SensorView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';
import LocationHeader from '../home/LocationHeader';

interface SensorData {
  humedad: number;
  unidad: string;
  ultima_lectura_ms: number;
  proxima_lectura_en_ms: number;
}

const SensorView = () => {
  const [humedad, setHumedad] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<string>('Nunca');
  const [nextUpdate, setNextUpdate] = useState<string>('--');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sensando, setSensando] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);

  const ipAddress = '192.168.1.100'; // Cambiar por tu IP

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${ipAddress}/datos`);
      const data: SensorData = await response.json();

      setHumedad(data.humedad);

      const lastUpdateSec = Math.floor((Date.now() - data.ultima_lectura_ms) / 1000);
      setLastUpdate(lastUpdateSec < 60 ? `${lastUpdateSec} segundos` : `${Math.floor(lastUpdateSec / 60)} minutos`);

      setNextUpdate(`${Math.ceil(data.proxima_lectura_en_ms / 1000)} segundos`);

      setError(null);
    } catch (err) {
      setError('Error conectando al sensor');
      console.error('Error fetching sensor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const startMonitoring = () => {
    setSensando(true);
    fetchSensorData(); // Obtener inmediatamente
    intervalRef.current = setInterval(fetchSensorData, 10000); // Luego cada 10s
  };

  const stopMonitoring = () => {
    setSensando(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  let estado = '';
  let color = '#9e9e9e';

  if (!loading && !error) {
    if (humedad < 30) {
      estado = 'Baja';
      color = '#f44336';
    } else if (humedad <= 60) {
      estado = 'Normal';
      color = '#4caf50';
    } else {
      estado = 'Alta';
      color = '#ff9800';
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <LocationHeader locationName='Sensor de Humedad' />
      <View className='justify-center items-center flex-1'>
        <View className="bg-white rounded-2xl p-6 mb-6 shadow mt-10">
          <Text style={styles.title}>Sensor de Humedad</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={50} color="#f44336" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={sensando ? stopMonitoring : startMonitoring}
              style={styles.circularButton}>
              <AnimatedCircularProgress
                size={200}
                width={15}
                fill={loading ? 0 : humedad}
                tintColor={color}
                backgroundColor="#e0e0e0"
                rotation={0}
                duration={1000}>
                {() => (
                  <View style={styles.innerText}>
                    {!sensando ? (
                      <>
                        <Ionicons name="play" size={40} color="#15803D" />
                        <Text style={{ fontSize: 16, color: '#15803D' }}>Comenzar</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.humidityValue}>{humedad}%</Text>
                        <Text style={{ color, fontSize: 20 }}>{estado}</Text>
                        <Ionicons name="pause" size={30} color={color} style={{ marginTop: 10 }} />
                      </>
                    )}
                  </View>
                )}
              </AnimatedCircularProgress>
            </TouchableOpacity>
          )}

          {sensando && !loading && !error && (
            <>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Ionicons name="time" size={20} color="#555" />
                  <Text style={styles.infoText}>Última actualización: {lastUpdate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="timer-outline" size={20} color="#555" />
                  <Text style={styles.infoText}>Próxima lectura: {nextUpdate}</Text>
                </View>
              </View>

              <View style={styles.descriptionBox}>
                <Text style={styles.description}>
                  {humedad < 30
                    ? '¡El suelo está muy seco! Considera regar la planta.'
                    : humedad <= 60
                      ? 'El nivel de humedad es adecuado para la mayoría de plantas.'
                      : '¡El suelo está muy húmedo! Reduce el riego.'}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f4fefc', padding: 20,
  },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 20,
  },
  circularButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  humidityValue: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  descriptionBox: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SensorView;
