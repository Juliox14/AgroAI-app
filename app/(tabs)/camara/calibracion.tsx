// app/(tabs)/camara/calibracion.tsx
import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import InstruccionesCalibración from '../../../components/camara/calibracion/InstruccionesCalibracion';
import CapturaCalibración from '../../../components/camara/calibracion/CapturaCalibracion';

type Paso = 'instrucciones' | 'captura_noir' | 'captura_rgb';

export default function Calibracion() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>('instrucciones');

  return (
    <View className="flex-1">
      {paso === 'instrucciones' && (
        <InstruccionesCalibración
          onSiguiente={() => setPaso('captura_rgb')}
          onCancelar={() => router.back()}
        />
      )}
      {paso === 'captura_noir' && (
        <CapturaCalibración
          camara="noir"
          onCalibrado={() => setPaso('captura_rgb')}
          onCancelar={() => router.back()}
        />
      )}
      {paso === 'captura_rgb' && (
        <CapturaCalibración
          camara="rgb"
          onCalibrado={() => router.push('/(tabs)/camara')}
          onCancelar={() => router.back()}
        />
      )}
    </View>
  );
}