import Camara from '@/components/camara/Camara';
import { useCameraPermissions } from 'expo-camera';
import { View, Text, TouchableOpacity, SafeAreaView, } from 'react-native';


export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();


  if (!permission) return <View className="flex-1 bg-black" />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-4">
        <Text className="text-white text-lg mb-4 text-center">
          Necesitamos acceso a la cámara
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-green-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }



  return (
    <SafeAreaView className="flex-1 bg-black">
      <Camara />
    </SafeAreaView>
  );
}


