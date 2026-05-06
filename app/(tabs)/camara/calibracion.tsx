// app/(tabs)/camara/calibracion.tsx
import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import InstruccionesCalibración from '../../../components/camara/calibracion/InstruccionesCalibracion';
import CapturaCalibración from '../../../components/camara/calibracion/CapturaCalibracion';

type Paso = 'instrucciones' | 'captura';

export default function Calibracion() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>('instrucciones');

  return (
    <View className="flex-1">
      {paso === 'instrucciones' && (
        <InstruccionesCalibración
          onSiguiente={() => setPaso('captura')}
          onCancelar={() => router.back()}
        />
      )}
      {paso === 'captura' && (
        <CapturaCalibración
          onCalibrado={() => router.push('/(tabs)/camara')}
          onCancelar={() => router.back()}
        />
      )}
    </View>
  );
}