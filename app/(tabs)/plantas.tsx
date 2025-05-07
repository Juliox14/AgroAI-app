import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Imagen = {
  id_imagen: number;
  uri_imagen: string;
  nombre_imagen: string;
};

type Registro = {
  id_registro: number;
  fecha_registro: string;
  healthy_percentage: number;
  stressed_percentage: number;
  dry_percentage: number;
  anomaly_percentage: number;
  imagenes: Imagen[];
};

type Planta = {
  id_planta: number;
  nombre: string;
  nombre_cientifico: string;
  uri_imagen: string;
};

type Expediente = {
  id_expediente: number;
  fecha_creacion: string;
  planta: Planta;
  registros: Registro[] | null;
};

export default function Plantas() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const res = await fetch('http://localhost:3004/database/get/1');
        console.log(":", res);
        const json = await res.json();
        setExpedientes(json[0].obtener_expedientes_usuario);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpedientes();
  }, []);

  if (loading) return <ActivityIndicator className="mt-10" size="large" color="#00cc99" />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4 text-center">Mis Plantas</Text>
      <FlatList
        data={expedientes}
        keyExtractor={(item) => item.id_expediente.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl mb-4 p-4 shadow">
            <Image source={{ uri: item.planta.uri_imagen }} style={styles.image} />
            <Text className="text-xl font-semibold mt-2">{item.planta.nombre}</Text>
            <Text className="text-sm text-gray-600 italic">{item.planta.nombre_cientifico}</Text>
            <Text className="text-xs text-gray-400 mt-1">Expediente #{item.id_expediente}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
});