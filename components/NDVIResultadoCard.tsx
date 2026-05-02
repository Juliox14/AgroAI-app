// components/NDVIResultadoCard.tsx
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  ndvi_promedio: number;
  ndvi_minimo:   number;
  ndvi_maximo:   number;
  ndvi_mediana:  number;
  imagen_url:    string;
}

function interpretarNDVI(promedio: number): { mensaje: string; color: string; icono: any } {
  if (promedio < 0)   return { mensaje: 'Sin vegetación detectable',       color: '#ef4444', icono: 'ban' };
  if (promedio < 0.2) return { mensaje: 'Vegetación escasa o bajo estrés', color: '#f97316', icono: 'warning' };
  if (promedio < 0.5) return { mensaje: 'Vegetación en estado moderado',   color: '#eab308', icono: 'partly-sunny' };
  return               { mensaje: 'Vegetación densa y saludable',           color: '#22c55e', icono: 'leaf' };
}

const StatCard = ({ label, valor, descripcion }: { label: string; valor: number; descripcion: string }) => (
  <View className="bg-gray-50 rounded-2xl p-4 flex-1">
    <Text className="text-gray-400 text-xs mb-1">{label}</Text>
    <Text className="text-gray-800 font-bold text-2xl">{valor.toFixed(3)}</Text>
    <Text className="text-gray-400 text-xs mt-1">{descripcion}</Text>
  </View>
);

export default function NDVIResultadoCard({ ndvi_promedio, ndvi_minimo, ndvi_maximo, ndvi_mediana, imagen_url }: Props) {
  const interpretacion = interpretarNDVI(ndvi_promedio);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.titulo}>Resultados del análisis NDVI</Text>

      {/* Colormap */}
      <Image
        source={{ uri: imagen_url }}
        style={styles.imagen}
        resizeMode="cover"
      />

      {/* Leyenda del colormap */}
      <View className="flex-row justify-between px-1">
        {[
          { color: '#d73027', label: 'Sin vegetación' },
          { color: '#fee08b', label: 'Escasa' },
          { color: '#1a9850', label: 'Sana' },
        ].map(({ color, label }) => (
          <View key={label} className="flex-row items-center gap-1">
            <View style={{ backgroundColor: color, width: 10, height: 10, borderRadius: 2 }} />
            <Text className="text-gray-500 text-xs">{label}</Text>
          </View>
        ))}
      </View>

      {/* Interpretación general */}
      <View style={[styles.badge, { backgroundColor: interpretacion.color + '15', borderColor: interpretacion.color }]}
        className="flex-row items-center gap-2 self-center">
        <Ionicons name={interpretacion.icono} size={16} color={interpretacion.color} />
        <Text style={[styles.badgeTexto, { color: interpretacion.color }]}>
          {interpretacion.mensaje}
        </Text>
      </View>

      {/* Estadísticas */}
      <Text className="text-gray-700 font-bold text-base">Estadísticas NDVI</Text>
      <Text className="text-gray-400 text-xs -mt-3">
        Rango de valores: −1 (sin vegetación) a +1 (vegetación máxima)
      </Text>

      <View className="flex-row gap-3">
        <StatCard label="Promedio"  valor={ndvi_promedio} descripcion="Salud general del cultivo" />
        <StatCard label="Mediana"   valor={ndvi_mediana}  descripcion="Valor central representativo" />
      </View>
      <View className="flex-row gap-3">
        <StatCard label="Mínimo"    valor={ndvi_minimo}   descripcion="Zona con menor vegetación" />
        <StatCard label="Máximo"    valor={ndvi_maximo}   descripcion="Zona con mayor vegetación" />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:   { flex: 1, backgroundColor: '#fff' },
  content:  { padding: 24, gap: 16 },
  titulo:   { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1f2937' },
  imagen:   { width: '100%', height: 220, borderRadius: 12 },
  badge:    { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeTexto: { fontWeight: '600', fontSize: 14 },
});