// components/camara/Camara.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';

import Boton from './Boton';
import CargandoAnalisis from '../Analizando';

const RASPBERRY_IP       = process.env.EXPO_PUBLIC_RASPBERRY_IP_ADDRESS;
const WHEP_NOIR_URL      = `http://${RASPBERRY_IP}:8889/camara_noir/whep`;
const WHEP_RGB_URL       = `http://${RASPBERRY_IP}:8889/camara_rgb/whep`;
const NDVI_PROCESAR_URL  = `http://${RASPBERRY_IP}:5000/ndvi/procesar`;

export default function Camara() {
  const router = useRouter();

  const [analizando,      setAnalizando]      = useState(false);
  const [streamErrorNoir, setStreamErrorNoir] = useState(false);
  const [streamErrorRgb,  setStreamErrorRgb]  = useState(false);
  
  // Estado para forzar el re-montaje de los WebViews
  const [reloadKey, setReloadKey] = useState(0);

  const recargarStreams = () => {
    // 1. Limpiamos los errores visuales
    setStreamErrorNoir(false);
    setStreamErrorRgb(false);
    // 2. Forzamos a los WebViews a reconstruirse desde cero
    setReloadKey(prev => prev + 1);
  };

  const analizarNDVI = async () => {
    if (analizando) return;
    setAnalizando(true);

    try {
      const res = await fetch(NDVI_PROCESAR_URL, { method: 'POST' });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? 'Error al procesar NDVI');
      }

      const data = await res.json();

      router.push({
        pathname: '/resultados/SeleccionarParcela',
        params: {
          ndvi_promedio: String(data.estadisticas.promedio),
          ndvi_minimo:   String(data.estadisticas.minimo),
          ndvi_maximo:   String(data.estadisticas.maximo),
          ndvi_mediana:  String(data.estadisticas.mediana),
        },
      });

    } catch (e: any) {
      const mensaje = e.message ?? 'No se pudo procesar el análisis';

      if (mensaje.includes('calibrar')) {
        Alert.alert(
          'Calibración requerida',
          'Debes calibrar las cámaras antes de analizar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Calibrar ahora', onPress: () => router.push('/(tabs)/camara/calibracion') },
          ]
        );
      } else {
        Alert.alert('Error', mensaje);
      }
    } finally {
      setAnalizando(false);
    }
  };

  const StreamCamara = ({
    url, titulo, color, streamError, onError
  }: {
    url: string; titulo: string; color: string;
    streamError: boolean; onError: () => void;
  }) => (
    <View className="w-full aspect-video rounded-xl overflow-hidden relative">
      <View className="absolute top-2 left-2 z-10 flex-row items-center bg-black/50 px-3 py-1 rounded-full border border-white/15">
        <View style={{ backgroundColor: streamError ? '#ef4444' : color }}
          className="w-1.5 h-1.5 rounded-full mr-2" />
        <Text className="text-white text-xs font-semibold tracking-wide">{titulo}</Text>
      </View>

      {/* Botón de recarga individual por si solo falla una cámara */}
      {streamError && (
        <TouchableOpacity 
          onPress={recargarStreams}
          className="absolute inset-0 z-20 justify-center items-center bg-zinc-900"
        >
          <Ionicons name="refresh-circle-outline" size={48} color="#71717a" />
          <Text className="text-zinc-400 text-sm font-medium mt-2">Toca para recargar cámara</Text>
        </TouchableOpacity>
      )}

      {!streamError && (
        <WebView
          key={reloadKey} // <- El truco maestro: cambia el valor y el componente se reinicia
          source={{
            html: `
              <!DOCTYPE html><html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>* { margin:0; padding:0; } body { background:black; width:100vw; height:100vh; } video { width:100%; height:100%; object-fit:cover; }</style>
              </head>
              <body>
              <video id="v" autoplay muted playsinline></video>
              <script>
                const pc = new RTCPeerConnection();
                const v  = document.getElementById('v');
                const t  = setTimeout(() => { window.ReactNativeWebView.postMessage('error'); pc.close(); }, 5000);
                pc.addTransceiver('video', { direction: 'recvonly' });
                pc.ontrack = (e) => { clearTimeout(t); v.srcObject = e.streams[0]; };
                pc.createOffer()
                  .then(o => { pc.setLocalDescription(o); return fetch('${url}', { method:'POST', headers:{'Content-Type':'application/sdp'}, body:o.sdp }); })
                  .then(r => r.text())
                  .then(sdp => pc.setRemoteDescription({ type:'answer', sdp }))
                  .catch(() => { clearTimeout(t); window.ReactNativeWebView.postMessage('error'); });
              </script>
              </body></html>
            `
          }}
          originWhitelist={['*']}
          mixedContentMode="always"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          scrollEnabled={false}
          style={{ flex: 1 }}
          onMessage={(e) => { if (e.nativeEvent.data === 'error') onError(); }}
          onError={onError}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={color} />
              <Text className="text-[#a3a3a3] mt-3 text-sm">Conectando a {titulo}...</Text>
            </View>
          )}
        />
      )}
    </View>
  );

  const streamsOk = !streamErrorNoir && !streamErrorRgb;

  return (
    <View className="flex-1 relative bg-black justify-center gap-3">

      <StreamCamara
        url={WHEP_NOIR_URL}
        titulo="Cámara NoIR"
        color="#22c55e"
        streamError={streamErrorNoir}
        onError={() => setStreamErrorNoir(true)}
      />

      <StreamCamara
        url={WHEP_RGB_URL}
        titulo="Cámara RGB"
        color="#3b82f6"
        streamError={streamErrorRgb}
        onError={() => setStreamErrorRgb(true)}
      />

      <CargandoAnalisis visible={analizando} />

      <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
        <Boton onPress={() => router.back()} ioniconName="arrow-back" iconSize={24} iconColor="white" />
        
        <View className="flex-row items-center bg-black/50 px-3 py-1 rounded-2xl border border-white/20">
          <View className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
          <Text className="text-white text-xs font-bold tracking-widest">LIVE</Text>
        </View>
        
        {/* Botón de recarga global en la esquina superior derecha */}
        <Boton onPress={recargarStreams} ioniconName="refresh" iconSize={24} iconColor="white" />
      </View>

      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center px-10 bg-black/40 py-2.5">
        <TouchableOpacity
          onPress={analizarNDVI}
          disabled={!streamsOk || analizando}
          className={`w-20 h-20 rounded-full border-4 justify-center items-center ${
            streamsOk ? 'border-green-400/80' : 'border-white/20'
          }`}
        >
          <View className={`w-16 h-16 rounded-full justify-center items-center ${
            streamsOk ? 'bg-green-500/80' : 'bg-white/20'
          }`}>
            {analizando
              ? <ActivityIndicator size="small" color="white" />
              : <Ionicons name="leaf" size={28} color="white" />
            }
          </View>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
});