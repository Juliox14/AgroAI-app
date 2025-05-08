import { useLocalSearchParams } from 'expo-router';
import NDVIResultComponent from '@/components/NDVIResultComponent';
import NDVIPrueba from '@/components/NDVIPrueba';

export default function NDVIResult() {
  const { stats } = useLocalSearchParams();

  // const parsedStats = JSON.parse(stats as string);

  return (
    // <NDVIResultComponent stats={parsedStats} />
    <NDVIPrueba />
  );
}
