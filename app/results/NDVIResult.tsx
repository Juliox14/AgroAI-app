import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import NDVIResultComponent from '@/components/NDVIResultComponent';
import NDVIPrueba from '@/components/NDVIPrueba';

export default function NDVIResult() {
  const { stats, image } = useLocalSearchParams();

  // const parsedStats = JSON.parse(stats as string);
  // const base64 = image as string;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <NDVIResultComponent stats={parsedStats} imageBase64={base64} /> */}
      <NDVIPrueba />
    </SafeAreaView>
  );
}
