import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Boton from './Boton';
import PreviewImagen from './PreviewImagen';
import FlujoCaptura from './FlujoCaptura';
import MarcoGuia from './MarcoGuia';
import { Asset } from 'expo-asset';
import axios from 'axios';
import { useLocalIp } from '@/hooks/useLocalIp';
import CargandoAnalisis from '../Analizando'; // Ajusta la ruta si está en otro directorio




const ip = useLocalIp();


type CapturedPhoto = {
  filtro: 'Sin filtro' | 'Filtro azul' | 'Filtro IR';
  uri: string | null;
};



export default function Camara() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([
    { filtro: 'Sin filtro', uri: null },
    { filtro: 'Filtro azul', uri: null },
    { filtro: 'Filtro IR', uri: null },
  ]);
  const [facing, setFacing] = useState<CameraType>('back');
  const [analizando, setAnalizando] = useState(false);
  const cameraRef: any = useRef(null);
  const router = useRouter();

  const mostrarInstrucciones = () => {
    setShowInstructions(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    mostrarInstrucciones();
  }, []);

  useEffect(() => {
    const cambiarFiltro = async () => {
      const currentPhoto = capturedPhotos.find((foto) => foto.uri === null);

      if (currentPhoto) {
        const filter = currentPhoto.filtro;

        try {
          let angulo = 90;
          if (filter === 'Filtro azul') {
            angulo = 150;
          } else if (filter === 'Filtro IR') {
            angulo = 10;
          }

          await axios.get(`http://192.168.193.101/move?angle=${angulo}`);

          console.log(`🛰️ Filtro cambiado a ${filter} (ángulo ${angulo}°)`);
        } catch (error: any) {
          console.error('❗ Error al cambiar el filtro:', error.message);
        }
      }
    };

    cambiarFiltro();
  }, [capturedPhotos]);


  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      const nextIndex = capturedPhotos.findIndex((foto) => foto.uri === null);
      console.log(capturedPhotos);
      if (nextIndex !== -1) {
        const newPhotos = [...capturedPhotos];
        newPhotos[nextIndex].uri = photo.uri;
        setCapturedPhotos(newPhotos);
      }

    }
  };


  const cancelarFoto = (index: number) => {
    const newPhotos = [...capturedPhotos];
    newPhotos[index].uri = null;
    setCapturedPhotos(newPhotos);
  };


  const enviarFotos = async () => {
    try {
      const faltantes = capturedPhotos.filter((foto) => !foto.uri);
      if (faltantes.length > 0) {
        alert('Por favor toma las 3 fotos antes de enviar.');
        return;
      }
  
      // Mostrar overlay de carga
      setAnalizando(true);
  
      // Esperar 500ms para mostrar animación antes del envío real
      setTimeout(async () => {
        const formData = new FormData();
        formData.append('nombre', 'captura_agroai');
  
        for (const foto of capturedPhotos) {
          if (!foto.uri) continue;
  
          const fieldName =
            foto.filtro === 'Sin filtro'
              ? 'sin_filtro'
              : foto.filtro === 'Filtro azul'
              ? 'filtro_azul'
              : 'filtro_ir';
  
          formData.append(fieldName, {
            uri: foto.uri,
            type: 'image/jpeg',
            name: `${fieldName}.jpg`,
          } as any);
        }
  
        const response = await axios.post(`http://192.168.193.166:3000/ndvi/procesar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const ndviStats = response.data.ndviStats;
  
        // ✅ Redirigir a la pantalla de resultados con solo las stats
        router.push({
          pathname: '/results/NDVIResult',
          params: {
            stats: JSON.stringify(ndviStats), // 📦 ¡importante! stringify para que pueda parsearse después
          },
        });
  
        setAnalizando(false); // ocultar overlay
      }, 500);
  
    } catch (error: any) {
      console.error('❗ Error al enviar imágenes:', error);
      alert('Error al enviar las imágenes');
      setAnalizando(false);
    }
  };
  




  return (
    <CameraView
      ref={cameraRef}
      facing={facing}
      style={styles.camera}
    >

      <MarcoGuia />


      <CargandoAnalisis visible={analizando} />


      <View className="absolute top-6 left-5 right-5 flex-row justify-between">
        <Boton
          onPress={() => router.back()}
          ioniconName="arrow-back"
          iconSize={24}
          iconColor="white"
        />
        <Boton
          onPress={mostrarInstrucciones}
          ioniconName="help-circle-outline"
          iconSize={24}
          iconColor="white"
        />
      </View>

      <View className="absolute bottom-36 left-5 right-5 flex-row justify-center gap-4 items-center">
        {capturedPhotos.map((foto, index) => (
          <PreviewImagen
            key={index}
            titulo={foto.filtro}
            uri={foto.uri}
            onCancel={() => cancelarFoto(index)}
          />
        ))}
      </View>

      {/* Barra inferior */}
      <View className="absolute bottom-6 flex-row justify-between bg-black-200/40 w-full p-4 px-10 items-center">
        <Boton
          onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
          ioniconName="camera-reverse-outline"
          iconSize={24}
          iconColor="white"
        />

        {/* Botón de capturar */}
        <TouchableOpacity
          onPress={takePicture}
          className="border-white/60 rounded-full w-20 h-20 justify-center border-4 items-center"
        >
          <View className="w-16 h-16 rounded-full bg-gray-100/70" />
        </TouchableOpacity>

        {/* Botón de enviar */}
        <Boton
          onPress={enviarFotos}
          ioniconName="checkmark-outline"
          iconSize={24}
          iconColor={capturedPhotos.every((uri) => uri !== null) ? 'white' : 'gray'}
        />
      </View>
      {showInstructions && (
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute inset-0 bg-black/60 justify-center items-center p-6 z-20"
        >
          <FlujoCaptura onClose={() => setShowInstructions(false)} />


        </Animated.View>
      )}

    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },

});
