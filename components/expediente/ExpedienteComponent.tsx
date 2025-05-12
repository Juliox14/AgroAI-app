// components/ExpedienteComponent.tsx
import { StyleSheet, ScrollView, Text, Image, View } from 'react-native';
import RegistroComponent from "./Registro";
import { ExpedienteComponentProps } from "@/interfaces/components";

export default function ExpedienteComponent({ expediente }: ExpedienteComponentProps) {
  if (!expediente) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold">
          No hay expediente
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-2 mb-6">
        <View className="flex-1 gap-2">
          <Text className="text-2xl font-bold">
            {expediente.planta.name}
          </Text>
          <Text className="text-md">
            {expediente.planta.nombre_cientifico}
          </Text>
        </View>
        <Image
          source={{ uri: expediente.uri_imagen_principal }}
          className="w-32 h-32 rounded-full"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold mb-2">Historial de Registros</Text>
        {expediente.registros.map((registro, index) => (
          <RegistroComponent key={index} registro={registro} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
    gap: 20,
  },
});