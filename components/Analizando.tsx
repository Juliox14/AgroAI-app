import { View, Text, ActivityIndicator, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface Props {
  visible: boolean;
}

const CargandoAnalisis = ({ visible }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="absolute inset-0 bg-black/60 justify-center items-center z-50 p-6"
    >
      <View className="bg-white rounded-xl p-8 shadow-xl items-center w-11/12">
        <ActivityIndicator size="large" color="#16a34a" className="mb-4" />
        <Text className="text-lg font-semibold text-gray-800 text-center">
          Espera mientras se analizan las imágenes...
        </Text>
      </View>
    </Animated.View>
  );
};

export default CargandoAnalisis;
