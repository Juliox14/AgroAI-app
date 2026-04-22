import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

import MarcoGuia from './MarcoGuia';
import Boton from './Boton';
import PreviewImagen from './PreviewImagen';
import CargandoAnalisis from '../Analizando';

const RASPBERRY_IP = process.env.EXPO_PUBLIC_RASPBERRY_IP;
const RASPBERRY_WHEP_URL = `http://${RASPBERRY_IP}:8889/camara_noir/whep`;
const RASPBERRY_SNAPSHOT_URL = 'http://${process.env.RASPBERRY_PUBLIC_IP_ADDRESS}:5000/capturar';

export default function Camara() {
  const router = useRouter();

  // Ahora solo manejamos UNA sola foto capturada
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [analizando, setAnalizando] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [streamError, setStreamError] = useState(false);

  // 🟢 Tomar foto (Descarga la imagen desde la Raspberry Pi al Caché)
  const takePicture = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      const directorioTemporal = (FileSystem as any).cacheDirectory;
      const fileUri = `${directorioTemporal}captura_agroai_${Date.now()}.jpg`;

      // Descargar la imagen de alta resolución
      const { uri } = await (FileSystem as any).downloadAsync(RASPBERRY_SNAPSHOT_URL, fileUri);

      setCapturedPhoto(uri);
    } catch (error) {
      alert('Error: No se pudo obtener la captura de la Raspberry Pi');
      console.error(error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Cancelar la foto tomada
  const cancelarFoto = () => {
    setCapturedPhoto(null);
  };

  // 🟢 Enviar al backend
  const enviarFoto = async () => {
    if (!capturedPhoto) {
      alert('Toma una captura primero');
      return;
    }

    setAnalizando(true);

    try {
      const form = new FormData();
      form.append('nombre', 'captura_noir');
      form.append('imagen', {
        uri: capturedPhoto,
        name: 'captura_noir.jpg',
        type: 'image/jpeg',
      } as any);

      // Asegúrate de que esta IP sea la de la computadora de tu amigo
      const urlEnvio = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/ndvi/procesar`;

      const res = await axios.post(urlEnvio, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { ndviStats, imagenNDVI } = res.data;

      router.push({
        pathname: '/results/NDVIResult',
        params: {
          stats: JSON.stringify(ndviStats),
          image: imagenNDVI,
        },
      });

    } catch (error) {
      alert('Error enviando la imagen al servidor');
      console.error(error);
    } finally {
      setAnalizando(false);
    }
  };

  return (
    <View className="flex-1 relative bg-black justify-center">
      {/* 🟢 Feed de Video WebRTC */}
      <View className="w-full aspect-video rounded-xl overflow-hidden">
        {/* Label NoIR */}
        <View className="absolute top-2 left-2 z-10 flex-row items-center bg-black/50 px-3 py-1 rounded-full border border-white/15">
          <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
          <Text className="text-white text-xs font-semibold tracking-wide">Cámara NoIR</Text>
        </View>

        {streamError ? (
          // Fallback
          <View className="flex-1 bg-zinc-900 justify-center items-center gap-2">
            <Ionicons name="videocam-off-outline" size={36} color="#71717a" />
            <Text className="text-zinc-500 text-sm font-medium">Cámara no disponible</Text>
            <Text className="text-zinc-600 text-xs">Verifica la conexión con la Raspberry Pi</Text>
          </View>
        ) : (
          <WebView
            source={{
              html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; }
            body { background: black; width: 100vw; height: 100vh; }
            video { width: 100%; height: 100%; object-fit: cover; }
          </style>
        </head>
        <body>
          <video id="video" autoplay muted playsinline></video>
          <script>
            const pc = new RTCPeerConnection();
            const video = document.getElementById('video');

            // Timeout de 5 segundos
            const timeout = setTimeout(() => {
              window.ReactNativeWebView.postMessage('error');
              pc.close();
            }, 5000);

            pc.addTransceiver('video', { direction: 'recvonly' });
            pc.ontrack = (e) => {
              clearTimeout(timeout); // Cancelar el timeout si conecta bien
              video.srcObject = e.streams[0];
            };

            pc.createOffer().then(offer => {
              pc.setLocalDescription(offer);
              return fetch('${RASPBERRY_WHEP_URL}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/sdp' },
                body: offer.sdp
              });
            }).then(r => r.text()).then(sdp => {
              pc.setRemoteDescription({ type: 'answer', sdp });
            }).catch(() => {
              clearTimeout(timeout);
              window.ReactNativeWebView.postMessage('error');
            });
          </script>
        </body>
        </html>
      ` }}
            originWhitelist={['*']}
            mixedContentMode="always"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            scrollEnabled={false}
            style={{ flex: 1 }}
            onMessage={(e) => {
              if (e.nativeEvent.data === 'error') setStreamError(true);
            }}
            onError={() => setStreamError(true)}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-[#a3a3a3] mt-3 text-sm">Conectando a cámara NoIR...</Text>
              </View>
            )}
          />
        )}
      </View>
      <CargandoAnalisis visible={analizando} />

      {/* Barra superior */}
      <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
        <Boton onPress={() => router.back()} ioniconName="arrow-back" iconSize={24} iconColor="white" />

        <View className="flex-row items-center bg-black/50 px-3 py-1 rounded-2xl border border-white/20">
          <View className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
          <Text className="text-white text-xs font-bold tracking-widest">LIVE</Text>
        </View>

        <View className="w-10" />
      </View>

      {/* Preview de la captura */}
      {capturedPhoto && (
        <View className="absolute bottom-28 left-0 right-0 items-center">
          <PreviewImagen
            titulo="Captura NoIR"
            uri={capturedPhoto}
            onCancel={cancelarFoto}
          />
        </View>
      )}

      {/* Barra inferior */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-between items-center px-10 bg-black/40 py-2.5">
        <View className="w-10" />

        <TouchableOpacity
          onPress={takePicture}
          disabled={isCapturing || streamError}
          className={`w-20 h-20 rounded-full border-4 justify-center items-center ${isCapturing || streamError ? 'border-white/20' : 'border-white/60'}`}
        >
          <View className={`w-16 h-16 rounded-full justify-center items-center ${isCapturing || streamError ? 'bg-white/20' : 'bg-white/70'}`}>
            {isCapturing && <ActivityIndicator size="small" color="#000" />}
          </View>
        </TouchableOpacity>

        <Boton
          onPress={enviarFoto}
          ioniconName="checkmark-outline"
          iconSize={24}
          iconColor="white"
          disabled={!capturedPhoto}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
