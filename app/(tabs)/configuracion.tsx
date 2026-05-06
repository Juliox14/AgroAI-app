import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, Alert, Share, Linking, Image, RefreshControl } from 'react-native';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import LocationHeader from '@/components/home/LocationHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from 'expo-router';

import { obtenerPendientes, ItemCola } from '@/utils/db';
import { sincronizarCola } from '@/utils/sync';

export default function ConfiguracionScreen() {
    const router = useRouter();
    const { colorScheme, setColorScheme } = useColorScheme();
    const [notificaciones, setNotificaciones] = useState(false);
    const [locationName, setLocationName] = useState('Cargando ubicación...');
    const { signOut, token } = useAuth();

    // ── Estado de la cola offline ────────────────────────────────────────────
    const [itemsCola, setItemsCola] = useState<ItemCola[]>([]);
    const [sincronizando, setSincronizando] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [colaExpandida, setColaExpandida] = useState(false);

    // Carga los pendientes de la cola
    const cargarCola = useCallback(() => {
        const pendientes = obtenerPendientes();
        setItemsCola(pendientes);
    }, []);

    // Recarga al entrar a la pantalla
    useFocusEffect(
        useCallback(() => {
            cargarCola();
        }, [cargarCola])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cargarCola();
        setRefreshing(false);
    }, [cargarCola]);

    const handleSincronizarManual = async () => {
        if (!token) return;
        setSincronizando(true);
        try {
            const baseUrl = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000`;
            const { exitosos, fallidos } = await sincronizarCola(baseUrl, token);
            cargarCola();

            if (exitosos > 0 && fallidos === 0) {
                Alert.alert('Sincronización completa', `${exitosos} análisis enviados correctamente.`);
            } else if (exitosos > 0 && fallidos > 0) {
                Alert.alert('Sincronización parcial', `${exitosos} enviados, ${fallidos} fallaron. Se reintentarán luego.`);
            } else if (fallidos > 0) {
                Alert.alert('Sin conexión', 'No se pudo conectar con el servidor. Inténtalo más tarde.');
            } else {
                Alert.alert('Cola vacía', 'No hay análisis pendientes por sincronizar.');
            }
        } finally {
            setSincronizando(false);
        }
    };

    // ── Ubicación ────────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se requiere ubicación.');
                return;
            }
            try {
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json`,
                    { headers: { 'Accept-Language': 'es' } }
                );
                const data = await res.json();
                const ciudad = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || '';
                const estado = data.address?.state || '';
                setLocationName(`${ciudad || '—'}, ${estado || '—'}`);
            } catch {
                setLocationName('Ubicación desconocida');
            }
        })().catch(() => setLocationName('Ubicación desconocida'));
    }, []);

    // ── Handlers existentes ──────────────────────────────────────────────────
    const handleRateApp = () => {
        const url = 'market://details?id=com.tuapp';
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'No se pudo abrir la tienda.')
        );
    };

    const handleShareApp = async () => {
        try {
            await Share.share({
                message: 'Mira AgroAI, la app que cuida tus cultivos multiespectrales: https://tuapp.link'
            });
        } catch (e) {
            console.error(e);
        }
    };

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'No se pudo abrir el enlace.')
        );
    };

    const handleLogout = () => {
        Alert.alert('Cerrar sesión', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => signOut() },
        ]);
    };

    // ── Helpers de UI ────────────────────────────────────────────────────────
    const formatearFecha = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const labelTipo = (tipo: ItemCola['tipo']) =>
        tipo === 'registro' ? 'Registro en expediente' : 'Nuevo expediente';

    const iconTipo = (tipo: ItemCola['tipo']) =>
        tipo === 'registro' ? 'bookmark-outline' : 'folder-outline';

    const pendientesCount = itemsCola.length;

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
            <View className='mt-8'>
                <LocationHeader locationName={locationName} />
            </View>
            <ScrollView
                contentContainerStyle={{ paddingVertical: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >

                {/* ── Sección: Cola offline ──────────────────────────────── */}
                <View className="mx-4 mb-4 rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800">

                    {/* Header de la sección */}
                    <TouchableOpacity
                        onPress={() => setColaExpandida(!colaExpandida)}
                        activeOpacity={0.7}
                        className="flex-row items-center px-5 py-4"
                    >
                        <View className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/50 items-center justify-center mr-3">
                            <Ionicons name="cloud-upload-outline" size={20} color="#b45309" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                Pendientes en cola
                            </Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {pendientesCount === 0
                                    ? 'Todo sincronizado'
                                    : `${pendientesCount} análisis esperando conexión`}
                            </Text>
                        </View>

                        {/* Badge contador */}
                        {pendientesCount > 0 && (
                            <View className="bg-amber-500 rounded-full w-6 h-6 items-center justify-center mr-2">
                                <Text className="text-white text-xs font-bold">{pendientesCount}</Text>
                            </View>
                        )}
                        <Ionicons
                            name={colaExpandida ? 'chevron-up' : 'chevron-down'}
                            size={18}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>

                    {/* Contenido expandible */}
                    {colaExpandida && (
                        <View className="border-t border-gray-100 dark:border-gray-700">
                            {pendientesCount === 0 ? (
                                // Estado vacío
                                <View className="items-center py-8 px-6">
                                    <View className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 items-center justify-center mb-3">
                                        <Ionicons name="checkmark-circle-outline" size={32} color="#16a34a" />
                                    </View>
                                    <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 text-center">
                                        Todo al día
                                    </Text>
                                    <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                                        No hay análisis esperando sincronización
                                    </Text>
                                </View>
                            ) : (
                                // Lista de items pendientes
                                <View>
                                    {itemsCola.map((item, index) => {
                                        const payload = JSON.parse(item.payload) as Record<string, string>;
                                        const esUltimo = index === itemsCola.length - 1;

                                        return (
                                            <View
                                                key={item.id}
                                                className={`px-5 py-4 flex-row items-center ${!esUltimo ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                                            >
                                                {/* Miniatura de imagen */}
                                                <View className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 mr-3 overflow-hidden items-center justify-center">
                                                    {item.image_uri ? (
                                                        <Image
                                                            source={{ uri: item.image_uri }}
                                                            style={{ width: 56, height: 56 }}
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <Ionicons name="image-outline" size={24} color="#9ca3af" />
                                                    )}
                                                </View>

                                                {/* Info del análisis */}
                                                <View className="flex-1">
                                                    <View className="flex-row items-center gap-2 mb-1">
                                                        <Ionicons name={iconTipo(item.tipo) as any} size={13} color="#b45309" />
                                                        <Text className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                            {labelTipo(item.tipo)}
                                                        </Text>
                                                    </View>

                                                    {/* Stats NDVI en fila */}
                                                    <View className="flex-row gap-2 flex-wrap">
                                                        <Text className="text-xs text-green-700 dark:text-green-400">
                                                            Sano: {payload.healthy ?? '—'}%
                                                        </Text>
                                                        <Text className="text-xs text-yellow-600 dark:text-yellow-400">
                                                            Estrés: {payload.stressed ?? '—'}%
                                                        </Text>
                                                        <Text className="text-xs text-red-500 dark:text-red-400">
                                                            Seco: {payload.dry ?? '—'}%
                                                        </Text>
                                                    </View>

                                                    <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                        {formatearFecha(item.creado_en)}
                                                    </Text>

                                                    {/* Advertencia si tiene muchos intentos fallidos */}
                                                    {item.intentos >= 3 && (
                                                        <View className="flex-row items-center mt-1 gap-1">
                                                            <Ionicons name="warning-outline" size={11} color="#dc2626" />
                                                            <Text className="text-xs text-red-500">
                                                                {item.intentos} intentos fallidos
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                {/* Indicador de estado */}
                                                <View className="w-2 h-2 rounded-full bg-amber-400 ml-2" />
                                            </View>
                                        );
                                    })}

                                    {/* Botón sincronizar manual */}
                                    <TouchableOpacity
                                        onPress={handleSincronizarManual}
                                        disabled={sincronizando}
                                        activeOpacity={0.8}
                                        className={`mx-4 my-4 py-3 rounded-xl flex-row items-center justify-center gap-2 ${sincronizando ? 'bg-amber-300' : 'bg-amber-500'}`}
                                    >
                                        <Ionicons
                                            name={sincronizando ? 'sync' : 'cloud-upload-outline'}
                                            size={18}
                                            color="white"
                                        />
                                        <Text className="text-white font-semibold text-sm">
                                            {sincronizando ? 'Sincronizando...' : 'Sincronizar ahora'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* ── Resto de opciones (igual que antes) ───────────────── */}

                {/* Modo oscuro */}
                <View className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]">
                    <Ionicons name="moon-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Modo oscuro</Text>
                    <Switch
                        value={colorScheme === 'dark'}
                        onValueChange={(val) => setColorScheme(val ? 'dark' : 'light')}
                    />
                </View>

                {/* Calificar app */}
                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleRateApp}>
                    <Ionicons name="star-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Calificar app</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Compartir app */}
                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleShareApp}>
                    <Ionicons name="share-social-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Compartir app</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Política de privacidad */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => router.push('/ajustes/politica')}
                >
                    <Ionicons name="lock-closed-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Política de privacidad</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Términos y condiciones */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => router.push('/ajustes/terminos')}
                >
                    <Ionicons name="document-text-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Términos y condiciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Política de cookies */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => router.push('/ajustes/cookies')}
                >
                    <Ionicons name="document-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Política de cookies</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Contacto */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => openLink('mailto:contacto@tuapp.com')}
                >
                    <Ionicons name="mail-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Contacto</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Comentarios */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => router.push('/ajustes/comentarios')}
                >
                    <Ionicons name="chatbox-ellipses-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Comentarios</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Cerrar sesión */}
                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#e53935" />
                    <Text className="flex-1 ml-4 text-base text-[#e53935]">Cerrar sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});