import { RegistroComponentProps } from "@/interfaces/components";
import ZoomableImage from "../ZoomableImage";
import Result from "../Result";
import { View, StyleSheet } from "react-native";
import AccordionItem from "../AccordionItem";

interface Props extends RegistroComponentProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function RegistroComponent({
  registro,
  index,
  expanded,
  onToggle,
}: Props) {
  return (
    <AccordionItem
      title={`Registro #${index}`}
      expanded={expanded}
      onPress={onToggle}
    >
      <View className="flex-1 gap-6">
        <ZoomableImage
          source={{ uri: registro.imagenes[0].uri }}
          thumbnailStyle={styles.previewImage}
        />

        <View className='flex-1 gap-6'>
          <Result nameIcon="leaf" value={registro.healthy} label="Porcentaje de vegetación sana" />
          <Result nameIcon="water" value={registro.stressed} label="Porcentaje de estrés hídrico" />
          <Result nameIcon="skull" value={registro.dry} label="Porcentaje de vegetación seca" />
          <Result nameIcon="alert-circle" value={registro.anomaly} label="Porcentaje de anomalías" />
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
