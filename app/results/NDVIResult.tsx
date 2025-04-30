import { useLocalSearchParams } from 'expo-router';
import NDVIResultComponent from '@/components/NDVIResultComponent';

export default function NDVIResult() {
  const { stats } = useLocalSearchParams();

  const parsedStats = JSON.parse(stats as string);

  return (
    <NDVIResultComponent stats={parsedStats} />
  );
}
