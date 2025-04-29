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
            angulo = 45;
          } else if (filter === 'Filtro IR') {
            angulo = 135;
          }

          await axios.get(`http://192.168.4.1/mover?angulo=${angulo}`);

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
      // 1. Cargar imágenes desde assets
      const [noFilterAsset, blueFilterAsset, irFilterAsset] = await Promise.all([
        Asset.loadAsync(require('../../assets/images/no_filter.jpeg')),
        Asset.loadAsync(require('../../assets/images/blue_filter.jpeg')),
        Asset.loadAsync(require('../../assets/images/ir_filter.jpeg')),
      ]);
  
      const formData = new FormData();
      formData.append('sin_filtro', {
        uri: noFilterAsset[0].localUri || noFilterAsset[0].uri,
        type: 'image/jpeg',
        name: 'no_filter.jpeg',
      } as any);
      formData.append('filtro_azul', {
        uri: blueFilterAsset[0].localUri || blueFilterAsset[0].uri,
        type: 'image/jpeg',
        name: 'blue_filter.jpeg',
      } as any);
      formData.append('filtro_ir', {
        uri: irFilterAsset[0].localUri || irFilterAsset[0].uri,
        type: 'image/jpeg',
        name: 'ir_filter.jpeg',
      } as any);
  
      // 2. Enviar al API Gateway
      const response = await axios.post('http://192.168.100.3:3000/ndvi/analizar-ndvi/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('✅ Respuesta del backend:', response.data);
      console.log('📊 NDVI Stats:', response.headers['x-ndvi-stats']);
  
    } catch (error: any) {
      console.error('❗ Error al enviar imágenes:', error.message);
    }
  };


  return (
    <CameraView
      ref={cameraRef}
      facing={facing}
      style={styles.camera}
    >

      <MarcoGuia />

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

      {/* Previews de imágenes */}
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
