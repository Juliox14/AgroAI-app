import { StyleSheet, ScrollView, Text, Image, View } from 'react-native';
import { useState } from 'react';
import RegistroComponent from "./Registro";
import { ExpedienteComponentProps } from "@/interfaces/components";

export default function ExpedienteComponent({ expediente }: ExpedienteComponentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!expediente) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text className="text-2xl font-bold">No hay expediente</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      {/* Cabecera planta */}
      <View className="flex-row items-center gap-2 mb-6">
        <View className="flex-1 gap-2">
          <Text className="text-3xl font-bold">{expediente.planta.name}</Text>
          <Text className="text-lg text-gray-500">
            {expediente.planta.nombre_cientifico}
          </Text>
        </View>
        <Image
          source={{ uri: expediente.uri_imagen_principal }}
          className="w-32 h-32 rounded-full"
        />
      </View>

      {/* Lista de registros */}
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-2">Historial de Registros</Text>
        {expediente.registros.map((registro, idx) => (
          <RegistroComponent
            key={idx}
            registro={registro}
            index={idx + 1}
            expanded={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 24, gap: 20 },
});
