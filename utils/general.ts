// Modifica la función para usar esta interfaz
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Función simplificada para trabajar con archivos en Expo + Hermes
export const createFileFromBase64 = async (base64String: string): Promise<any> => {
  try {
    // Asegúrate de que la cadena base64 esté limpia (sin prefijo)
    const base64Data = base64String.startsWith('data:') 
      ? base64String.split(',')[1] 
      : base64String;
    
    if (Platform.OS === 'web') {
      // En web podemos usar la API de Fetch para crear un blob
      const response = await fetch(`data:image/jpeg;base64,${base64Data}`);
      return await response.blob();
    } else {
      // En dispositivos móviles con Expo, usamos un enfoque diferente
      // Guardamos la imagen como un archivo temporal
      const tempFilePath = `${FileSystem.cacheDirectory}temp_upload_image_${Date.now()}.jpg`;
      
      await FileSystem.writeAsStringAsync(
        tempFilePath,
        base64Data,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      
      // Devolvemos un objeto con formato que FormData pueda procesar
      return {
        uri: tempFilePath,
        name: 'image.jpg',
        type: 'image/jpeg'
      };
    }
  } catch (error) {
    console.error('Error preparando la imagen:', error);
    throw error;
  }
};