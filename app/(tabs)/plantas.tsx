import PlantaCard from '@/components/PlantaCard';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

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
  const { payload } = useAuth();

  useEffect(() => {
    console.log(payload)
    const fetchExpedientes = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3004/database/get/8`);
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
          <PlantaCard
            idExpediente={item.id_expediente}
            nombre={item.planta.nombre}
            nombreCientifico={item.planta.nombre_cientifico}
            uriImagen={item.planta.uri_imagen}
            salud={item.registros ? item.registros[0].healthy_percentage : 0}
            estres={item.registros ? item.registros[0].stressed_percentage : 0}
            humedad={item.registros ? item.registros[0].dry_percentage : 0}
            anomalias={item.registros ? item.registros[0].anomaly_percentage : 0}
          />
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