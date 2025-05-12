// components/CustomToast.tsx
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomToastProps {
  message: string;
  visible: boolean;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, visible }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 3000); // Duración del toast en milisegundos
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        backgroundColor: '#D1FAE5',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Ionicons name="checkmark-circle" size={24} color="#10B981" style={{ marginRight: 8 }} />
      <Text style={{ color: '#065F46', fontSize: 16 }}>{message}</Text>
    </Animated.View>
  );
};

export default CustomToast;