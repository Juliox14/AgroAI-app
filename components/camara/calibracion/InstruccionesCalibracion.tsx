// components/camara/Calibracion/InstruccionesCalibración.tsx
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef } from 'react';

interface Props {
  onSiguiente: () => void;
  onCancelar: () => void;
}

const pasos = [
  {
    icono: 'sunny-outline',
    titulo: 'Calibra antes de cada sesión',
    descripcion: 'La luz del sol cambia durante el día. Para obtener resultados precisos, debes calibrar las cámaras cada vez que vayas a capturar imágenes.',
  },
  {
    icono: 'grid-outline',
    titulo: 'El tablero de calibración',
    descripcion: 'Usa el tablero de 6 colores con reflectancias conocidas. Cada color tiene valores específicos de reflectancia en luz roja e infrarroja que permiten corregir las cámaras.',
  },
  {
    icono: 'scan-outline',
    titulo: 'Cómo posicionarlo',
    descripcion: 'Coloca el tablero sobre una superficie plana, bien iluminada y sin sombras. Alinea los 6 cuadros dentro del marco guía que aparecerá en pantalla.',
  },
];

export default function InstruccionesCalibración({ onSiguiente, onCancelar }: Props) {
  const [pantallaActual, setPantallaActual] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const cambiarPantalla = (nueva: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0, duration: 200, useNativeDriver: true,
    }).start(() => {
      setPantallaActual(nueva);
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 200, useNativeDriver: true,
      }).start();
    });
  };

  const paso = pasos[pantallaActual];
  const esUltimo = pantallaActual === pasos.length - 1;

  return (
    <View className="flex-1 bg-white justify-between px-6 pt-16 pb-10">

      {/* Botón cancelar */}
      <TouchableOpacity onPress={onCancelar} className="absolute top-12 right-6">
        <Ionicons name="close-outline" size={28} color="#9ca3af" />
      </TouchableOpacity>

      {/* Indicador de progreso */}
      <View className="flex-row justify-center gap-2 mb-12">
        {pasos.map((_, i) => (
          <View
            key={i}
            className={`h-1.5 rounded-full ${i === pantallaActual ? 'w-6 bg-green-500' : 'w-2 bg-gray-200'}`}
          />
        ))}
      </View>

      {/* Contenido animado */}
      <Animated.View style={{ opacity: fadeAnim }} className="flex-1 justify-center items-center gap-6">
        <View className="w-24 h-24 rounded-full bg-green-50 justify-center items-center">
          <Ionicons name={paso.icono as any} size={48} color="#22c55e" />
        </View>

        <Text className="text-2xl font-bold text-gray-800 text-center">
          {paso.titulo}
        </Text>

        <Text className="text-base text-gray-500 text-center leading-6">
          {paso.descripcion}
        </Text>
      </Animated.View>

      {/* Navegación */}
      <View className="flex-row justify-between items-center mt-8">
        {pantallaActual > 0 ? (
          <TouchableOpacity onPress={() => cambiarPantalla(pantallaActual - 1)}>
            <Text className="text-gray-400 font-semibold">Anterior</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          onPress={esUltimo ? onSiguiente : () => cambiarPantalla(pantallaActual + 1)}
          className="bg-green-500 px-8 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">
            {esUltimo ? 'Comenzar calibración' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}