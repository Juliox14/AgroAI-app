import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import NDVIResultadoCard from '@/components/NDVIResultadoCard';
import BackButton from '@/components/BackButton';

export default function NDVIResultado() {
  const { ndvi_promedio, ndvi_minimo, ndvi_maximo, ndvi_mediana, imagen_url } =
    useLocalSearchParams<{
      ndvi_promedio: string;
      ndvi_minimo:   string;
      ndvi_maximo:   string;
      ndvi_mediana:  string;
      imagen_url:    string;
    }>();

  return (
    <SafeAreaView className="flex-1 bg-white py-12">
      <BackButton />
      <NDVIResultadoCard
        ndvi_promedio={parseFloat(ndvi_promedio)}
        ndvi_minimo={parseFloat(ndvi_minimo)}
        ndvi_maximo={parseFloat(ndvi_maximo)}
        ndvi_mediana={parseFloat(ndvi_mediana)}
        imagen_url={imagen_url}
      />
    </SafeAreaView>
  );
}