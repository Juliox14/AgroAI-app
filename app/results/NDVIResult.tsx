import { useLocalSearchParams } from 'expo-router';
import NDVIResultComponent from '@/components/NDVIResultComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NDVIResult() {
  const { stats } = useLocalSearchParams();

  const parsedStats = JSON.parse(stats as string);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NDVIResultComponent stats={parsedStats} />
    </SafeAreaView>
  );
}
