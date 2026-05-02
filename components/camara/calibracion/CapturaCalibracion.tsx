// components/camara/Calibracion/CapturaCalibración.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const MARCO_WIDTH  = width * 0.75;
const MARCO_HEIGHT = MARCO_WIDTH * 1.5; // proporción 2x3 del tablero
const CELDA_W      = MARCO_WIDTH / 2;
const CELDA_H      = MARCO_HEIGHT / 3;

const RASPBERRY_IP = process.env.EXPO_PUBLIC_RASPBERRY_IP_ADDRESS;
const WHEP_RGB     = `http://${RASPBERRY_IP}:8889/camara_rgb/whep`;
const CALIBRAR_URL = `http://${RASPBERRY_IP}:5000/calibrar`;

const COLORES = [
  { id: 1, nombre: 'Blanco',       color: '#f5f5f5' },
  { id: 2, nombre: 'Arena',        color: '#c2a97a' },
  { id: 3, nombre: 'Café',         color: '#5c3d1e' },
  { id: 4, nombre: 'Indian Birch', color: '#b07848' },
  { id: 5, nombre: 'Verde Bosque', color: '#2d5a1b' },
  { id: 6, nombre: 'Vino',         color: '#6b1a2a' },
];

type Estado = 'esperando' | 'calibrando' | 'listo' | 'error';

interface Props {
  onCalibrado: () => void;
  onCancelar:  () => void;
}

export default function CapturaCalibración({ onCalibrado, onCancelar }: Props) {
  const [streamError, setStreamError] = useState(false);
  const [estado,      setEstado]      = useState<Estado>('esperando');
  const [errorMsg,    setErrorMsg]    = useState('');

  const calibrar = async () => {
    setEstado('calibrando');
    setErrorMsg('');
    try {
      const res = await fetch(CALIBRAR_URL, { method: 'POST' });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? 'Error desconocido');
      }

      setEstado('listo');
    } catch (e: any) {
      setErrorMsg(e.message);
      if (e.message.includes('saturada')) {
        // Error recuperable — dejar al usuario reintentar
        setEstado('esperando');
      } else {
        setEstado('error');
      }
    }
  };

  return (
    <View className="flex-1 bg-black">

      {/* Botón cerrar */}
      <TouchableOpacity
        onPress={onCancelar}
        className="absolute top-12 right-4 z-20 bg-black/50 p-2 rounded-full border border-white/20"
      >
        <Ionicons name="close-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Stream RGB a pantalla completa */}
      {streamError ? (
        <View className="flex-1 justify-center items-center gap-3">
          <Ionicons name="videocam-off-outline" size={40} color="#71717a" />
          <Text className="text-zinc-500 text-sm">Stream RGB no disponible</Text>
        </View>
      ) : (
        <WebView
          source={{
            html: `
              <!DOCTYPE html><html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  * { margin:0; padding:0; }
                  body { background:black; width:100vw; height:100vh; overflow:hidden; }
                  video { width:100%; height:100%; object-fit:cover; }
                </style>
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
                  .then(o => { pc.setLocalDescription(o); return fetch('${WHEP_RGB}', { method:'POST', headers:{'Content-Type':'application/sdp'}, body:o.sdp }); })
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
          onMessage={(e) => { if (e.nativeEvent.data === 'error') setStreamError(true); }}
          onError={() => setStreamError(true)}
        />
      )}

      {/* Marco guía 2x3 sobre el stream */}
      <View style={styles.marcoContainer} pointerEvents="none">
        <Text style={styles.instruccion}>Alinea el tablero con el marco</Text>
        <View style={styles.marco}>
          {[0, 1, 2].map(fila => (
            <View key={fila} style={styles.fila}>
              {COLORES.slice(fila * 2, fila * 2 + 2).map(c => (
                <View key={c.id} style={styles.celda}>
                  <View style={[styles.circulo, { backgroundColor: c.color }]} />
                  <Text style={styles.celdaTexto}>{c.nombre}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Panel inferior */}
      <View className="bg-black/90 px-6 py-6 gap-3 border-t border-white/10 pb-10">

        {errorMsg !== '' && (
          <View className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3">
            <Text className="text-red-300 text-xs text-center">{errorMsg}</Text>
          </View>
        )}

        {estado === 'esperando' && (
          <TouchableOpacity
            onPress={calibrar}
            disabled={streamError}
            className={`py-4 rounded-full items-center ${streamError ? 'bg-zinc-700' : 'bg-green-500'}`}
          >
            <Text className="text-white font-bold text-base">Calibrar</Text>
          </TouchableOpacity>
        )}

        {estado === 'calibrando' && (
          <View className="items-center gap-3 py-2">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-white text-sm">Capturando y calibrando...</Text>
          </View>
        )}

        {estado === 'listo' && (
          <View className="items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
              <Text className="text-white font-semibold">Calibración exitosa</Text>
            </View>
            <TouchableOpacity
              onPress={onCalibrado}
              className="bg-green-500 py-4 rounded-full w-full items-center"
            >
              <Text className="text-white font-bold text-base">Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {estado === 'error' && (
          <View className="items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="close-circle" size={28} color="#ef4444" />
              <Text className="text-white font-semibold">Error al calibrar</Text>
            </View>
            <TouchableOpacity
              onPress={() => { setEstado('esperando'); setErrorMsg(''); }}
              className="bg-red-500 py-4 rounded-full w-full items-center"
            >
              <Text className="text-white font-bold">Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  marcoContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  instruccion: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  marco: {
    width: MARCO_WIDTH,
    height: MARCO_HEIGHT,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  fila: {
    flexDirection: 'row',
    flex: 1,
  },
  celda: {
    width: CELDA_W,
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  circulo: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  celdaTexto: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
});