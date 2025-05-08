import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import axios from 'axios';

import MarcoGuia from './MarcoGuia';
import Boton from './Boton';
import PreviewImagen from './PreviewImagen';
import FlujoCaptura from './FlujoCaptura';
import CargandoAnalisis from '../Analizando';

type CapturedPhoto = {
  filtro: 'Sin filtro' | 'Filtro azul' | 'Filtro IR';
  uri: string | null;
};

export default function Camara() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);

  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([
    { filtro: 'Sin filtro', uri: null },
    { filtro: 'Filtro azul', uri: null },
    { filtro: 'Filtro IR', uri: null },
  ]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [analizando, setAnalizando] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mostrar guía al montar
  useEffect(() => {
    setShowInstructions(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  // Alternar cámara front/back
  const toggleFacing = () => {
    setFacing(prev => (prev === 'back' ? 'front' : 'back'));
  };

  // Tomar foto
  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    const idx = capturedPhotos.findIndex(p => p.uri === null);
    if (idx !== -1) {
      const copy = [...capturedPhotos];
      copy[idx].uri = photo.uri;
      setCapturedPhotos(copy);
    }
  };

  // Cancelar una foto
  const cancelarFoto = (index: number) => {
    const copy = [...capturedPhotos];
    copy[index].uri = null;
    setCapturedPhotos(copy);
  };

  // Enviar al backend
  const enviarFotos = async () => {
    // if (capturedPhotos.some(p => p.uri === null)) {
    //   alert('Toma las 3 fotos primero');
    //   return;
    // }
    // setAnalizando(true);
    // setTimeout(async () => {
    //   try {
    //     const form = new FormData();
    //     form.append('nombre', 'captura_agroai');
    //     for (const p of capturedPhotos) {
    //       form.append(
    //         p.filtro === 'Sin filtro'
    //           ? 'sin_filtro'
    //           : p.filtro === 'Filtro azul'
    //           ? 'filtro_azul'
    //           : 'filtro_ir',
    //         { uri: p.uri!, name: `${p.filtro}.jpg`, type: 'image/jpeg' } as any
    //       );
    //     }
    //     const res = await axios.post('http://192.168.100.3:3000/ndvi/procesar', form, {
    //       headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    //     const stats = res.data.ndviStats;
        // router.push({ pathname: '/results/NDVIResult', params: { stats: JSON.stringify(stats) } });
        router.push({ pathname: '/results/NDVIResult' });
    //   } catch {
    //     alert('Error enviando imágenes');
    //   } finally {
    //     setAnalizando(false);
    //   }
    // }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Solo la cámara */}
      <CameraView ref={cameraRef} facing={facing} style={styles.camera} />

      {/* Superposiciones */}
      <MarcoGuia />

      <CargandoAnalisis visible={analizando} />

      {/* Barra superior */}
      <View style={styles.topBar}>
        <Boton onPress={() => router.back()} ioniconName="arrow-back" iconSize={24} iconColor="white" />
        <Boton
          onPress={() => {
            setShowInstructions(true);
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
          }}
          ioniconName="help-circle-outline"
          iconSize={24}
          iconColor="white"
        />
      </View>

      {/* Previews */}
      <View style={styles.previewContainer}>
        {capturedPhotos.map((foto, i) => (
          <PreviewImagen key={i} titulo={foto.filtro} uri={foto.uri} onCancel={() => cancelarFoto(i)} />
        ))}
      </View>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <Boton onPress={toggleFacing} ioniconName="camera-reverse-outline" iconSize={24} iconColor="white" />
        <TouchableOpacity onPress={takePicture} style={styles.shutter}>
          <View style={styles.innerShutter} />
        </TouchableOpacity>
        <Boton
          onPress={enviarFotos}
          ioniconName="checkmark-outline"
          iconSize={24}
          iconColor={capturedPhotos.every(p => p.uri) ? 'white' : 'gray'}
        />
      </View>

      {/* Instrucciones */}
      {showInstructions && (
        <Animated.View style={[styles.instructionsOverlay, { opacity: fadeAnim }]}>
          <FlujoCaptura onClose={() => setShowInstructions(false)} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewContainer: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  shutter: {
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.6)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerShutter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(200,200,200,0.7)',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 10,
  },
});
