// components/Registro.tsx
import { RegistroComponentProps } from "@/interfaces/components";
import ZoomableImage from "../ZoomableImage";
import Result from "../Result";
import { View, Text, StyleSheet } from "react-native";
import AccordionItem from "../AccordionItem";

export default function RegistroComponent({ registro }: RegistroComponentProps) {
  return (
    <AccordionItem title={`Registro #${registro.id_registro}`}>
      <View className="flex-1 gap-6">
        <ZoomableImage
          source={{ uri: registro.imagenes[0].uri }}
          thumbnailStyle={styles.previewImage}
        />

        <View className='flex-1 gap-6'>
          <Result
            nameIcon="leaf"
            value={registro.healthy}
            label="Porcentaje de vegetación sana"
          />

          <Result
            nameIcon="water"
            value={registro.stressed}
            label="Porcentaje de estrés hídrico"
          />

          <Result
            nameIcon="skull"
            value={registro.dry}
            label="Porcentaje de vegetación seca"
          />

          <Result
            nameIcon="alert-circle"
            value={registro.anomaly}
            label="Porcentaje de anomalías"
          />
        </View>
      </View>
    </AccordionItem>
  );
}

const styles = StyleSheet.create({
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
  },
});