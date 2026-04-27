// components/camara/Calibracion/CapturaCalibración.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';


const { width } = Dimensions.get('window');
const MARCO_SIZE = width - 48; // 24px padding por lado
const CELDA_SIZE = MARCO_SIZE / 2;

interface Props {
    camara: 'noir' | 'rgb';
    onCalibrado: () => void;
    onCancelar: () => void;
}

const RASPBERRY_IP = process.env.EXPO_PUBLIC_RASPBERRY_IP_ADDRESS;
const WHEP_NOIR = `http://${RASPBERRY_IP}:8889/camara_noir/whep`;
const WHEP_RGB = `http://${RASPBERRY_IP}:8889/camara_rgb/whep`;
const CALIBRAR_URL = `http://${RASPBERRY_IP}:5000/calibrar`;

const COLORES = [
    { id: 1, nombre: 'Blanco', color: '#f5f5f5' },
    { id: 2, nombre: 'Arena', color: '#c2a97a' },
    { id: 3, nombre: 'Café', color: '#5c3d1e' },
    { id: 4, nombre: 'Indian Birch', color: '#b07848' },
    { id: 5, nombre: 'Verde', color: '#2d5a1b' },
    { id: 6, nombre: 'Burdeos', color: '#6b1a2a' },
];

type Estado = 'esperando' | 'calibrando' | 'listo' | 'error';

export default function CapturaCalibración({ camara, onCalibrado, onCancelar }: Props) {
    const [streamError, setStreamError] = useState(false);
    const [estado, setEstado] = useState<Estado>('esperando');

    const whepUrl = camara === 'noir' ? WHEP_NOIR : WHEP_RGB;
    const titulo = camara === 'noir' ? 'Cámara NoIR' : 'Cámara RGB';
    const color = camara === 'noir' ? '#22c55e' : '#3b82f6';
    const siguiente = camara === 'noir' ? 'camara_rgb' : 'listo';

    const calibrar = async () => {
        setEstado('calibrando');
        try {
            const res = await fetch(`${CALIBRAR_URL}/${camara}`, { method: 'POST' });
            if (!res.ok) throw new Error();
            setEstado('listo');
        } catch {
            setEstado('error');
        }
    };

    return (
        <View className="flex-1 bg-black">

            {/* Header */}
            <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center z-10">
                <TouchableOpacity onPress={onCancelar}>
                    <Ionicons name="close-outline" size={32} color="white" />
                </TouchableOpacity>

                <View className="flex-row items-center bg-black/50 px-3 py-1 rounded-full border border-white/20">
                    <View style={{ backgroundColor: color }} className="w-2 h-2 rounded-full mr-2" />
                    <Text className="text-white text-xs font-semibold">{titulo}</Text>
                </View>

                <View className="w-8" />
            </View>

            {/* Stream */}
            <View className="flex-1">
                {streamError ? (
                    <View className="flex-1 bg-zinc-900 justify-center items-center gap-2">
                        <Ionicons name="videocam-off-outline" size={36} color="#71717a" />
                        <Text className="text-zinc-500 text-sm font-medium">Cámara no disponible</Text>
                    </View>
                ) : (
                    <WebView
                        source={{
                            html: `
              <!DOCTYPE html><html>
              <head><meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>* { margin:0; padding:0; } body { background:black; width:100vw; height:100vh; } video { width:100%; height:100%; object-fit:cover; }</style>
              </head>
              <body>
              <video id="video" autoplay muted playsinline></video>
              <script>
                const pc = new RTCPeerConnection();
                const video = document.getElementById('video');
                const timeout = setTimeout(() => { window.ReactNativeWebView.postMessage('error'); pc.close(); }, 5000);
                pc.addTransceiver('video', { direction: 'recvonly' });
                pc.ontrack = (e) => { clearTimeout(timeout); video.srcObject = e.streams[0]; };
                pc.createOffer().then(offer => {
                  pc.setLocalDescription(offer);
                  return fetch('${whepUrl}', { method:'POST', headers:{'Content-Type':'application/sdp'}, body:offer.sdp });
                }).then(r => r.text()).then(sdp => {
                  pc.setRemoteDescription({ type:'answer', sdp });
                }).catch(() => { clearTimeout(timeout); window.ReactNativeWebView.postMessage('error'); });
              </script>
              </body></html>
            ` }}
                        originWhitelist={['*']}
                        mixedContentMode="always"
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled={true}
                        scrollEnabled={false}
                        style={{ flex: 1 }}
                        onMessage={(e) => { if (e.nativeEvent.data === 'error') setStreamError(true); }}
                        onError={() => setStreamError(true)}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={styles.loader}>
                                <ActivityIndicator size="large" color={color} />
                                <Text className="text-zinc-400 mt-3 text-sm">Conectando a {titulo}...</Text>
                            </View>
                        )}
                    />
                )}

                {/* Marco guía 2x3 encima del stream */}
                <View style={styles.marcoContainer} pointerEvents="none">
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
                    <Text className="text-white/60 text-xs text-center mt-2">
                        Alinea el tablero dentro del marco
                    </Text>
                </View>
            </View>

            {/* Panel inferior */}
            <View className="bg-black/80 px-6 py-6 gap-4">

                {estado === 'esperando' && (
                    <>
                        <Text className="text-white/60 text-xs text-center">
                            Asegúrate de que los 6 cuadros estén dentro del marco y bien iluminados
                        </Text>
                        <TouchableOpacity
                            onPress={calibrar}
                            disabled={streamError}
                            className={`py-4 rounded-full items-center ${streamError ? 'bg-zinc-700' : 'bg-green-500'}`}
                        >
                            <Text className="text-white font-bold text-base">Calibrar</Text>
                        </TouchableOpacity>
                    </>
                )}

                {estado === 'calibrando' && (
                    <View className="items-center gap-3">
                        <ActivityIndicator size="large" color={color} />
                        <Text className="text-white text-sm">Procesando calibración...</Text>
                    </View>
                )}

                {estado === 'listo' && (
                    <View className="items-center gap-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
                            <Text className="text-white font-semibold">{titulo} calibrada correctamente</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onCalibrado}
                            className="bg-green-500 py-4 px-10 rounded-full"
                        >
                            <Text className="text-white font-bold text-base">
                                {camara === 'noir' ? 'Calibrar cámara RGB →' : '¡Listo, capturar!'}
                            </Text>
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
                            onPress={() => setEstado('esperando')}
                            className="bg-red-500 py-4 px-10 rounded-full"
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
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },
    marcoContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    marco: {
        width: MARCO_SIZE,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    fila: {
        flexDirection: 'row',
    },
    celda: {
        width: CELDA_SIZE,
        height: MARCO_SIZE / 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    circulo: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    celdaTexto: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '600',
    },
});