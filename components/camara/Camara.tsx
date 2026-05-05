import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, Alert, Share, Linking, Image, RefreshControl } from 'react-native';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';
import LocationHeader from '@/components/home/LocationHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from 'expo-router';

import { obtenerPendientes, ItemCola } from '@/utils/db';
import { sincronizarCola } from '@/utils/sync';

// ── Etiquetas e iconos por tipo ──────────────────────────────────────────────
const LABEL_TIPO: Record<ItemCola['tipo'], string> = {
    registro:         'Registro NDVI',
    nuevo_expediente: 'Nuevo expediente',
    nueva_parcela:    'Nueva parcela',
    editar_parcela:   'Edición de parcela',
};

const ICON_TIPO: Record<ItemCola['tipo'], string> = {
    registro:         'leaf-outline',
    nuevo_expediente: 'folder-outline',
    nueva_parcela:    'map-outline',
    editar_parcela:   'pencil-outline',
};

function descripcionItem(tipo: ItemCola['tipo'], payload: Record<string, string>): string {
    switch (tipo) {
        case 'registro':
        case 'nuevo_expediente':
            return `Sano ${payload.healthy ?? '—'}% · Estrés ${payload.stressed ?? '—'}% · Seco ${payload.dry ?? '—'}%`;
        case 'nueva_parcela':
        case 'editar_parcela':
            return [payload.nombre, payload.cultivos_asociados, payload.tipo_sistema]
                .filter(Boolean).join(' · ');
        default:
            return '';
    }
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function ConfiguracionScreen() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [locationName, setLocationName] = useState('Cargando ubicación...');
    const { signOut, token } = useAuth();

    const [itemsCola, setItemsCola] = useState<ItemCola[]>([]);
    const [sincronizando, setSincronizando] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [colaExpandida, setColaExpandida] = useState(false);

    const cargarCola = useCallback(() => {
        setItemsCola(obtenerPendientes());
    }, []);

    useFocusEffect(useCallback(() => { cargarCola(); }, [cargarCola]));

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
                Alert.alert('Sincronización completa', `${exitosos} elemento${exitosos > 1 ? 's' : ''} enviado${exitosos > 1 ? 's' : ''} correctamente.`);
            } else if (exitosos > 0 && fallidos > 0) {
                Alert.alert('Sincronización parcial', `${exitosos} enviados, ${fallidos} fallaron y se reintentarán luego.`);
            } else if (fallidos > 0) {
                Alert.alert('Sin conexión', 'No se pudo conectar con el servidor. Inténtalo más tarde.');
            } else {
                Alert.alert('Cola vacía', 'No hay elementos pendientes por sincronizar.');
            }
        } finally {
            setSincronizando(false);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { Alert.alert('Permiso denegado', 'Se requiere ubicación.'); return; }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const [place] = await Location.reverseGeocodeAsync(loc.coords);
            const fullState = normalizarEstado(place.region ?? '');
            const mun = place.city || place.district || place.subregion || '';
            setLocationName(`${mun || '—'}, ${fullState || '—'}`);
        })();
    }, []);

    const handleRateApp = () =>
        Linking.openURL('market://details?id=com.tuapp').catch(() => Alert.alert('Error', 'No se pudo abrir la tienda.'));

    const handleShareApp = async () => {
        try { await Share.share({ message: 'Mira AgroAI, la app que cuida tus cultivos: https://tuapp.link' }); }
        catch (e) { console.error(e); }
    };

    const openLink = (url: string) =>
        Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir el enlace.'));

    const handleLogout = () =>
        Alert.alert('Cerrar sesión', '¿Estás seguro?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => signOut() },
        ]);

    const formatearFecha = (iso: string) =>
        new Date(iso).toLocaleDateString('es-MX', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const pendientesCount = itemsCola.length;

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
            <View className="mt-8">
                <LocationHeader locationName={locationName} />
            </View>

            {/* ScrollView PRINCIPAL — altura nunca afectada por la cola */}
            <ScrollView
                contentContainerStyle={{ paddingVertical: 16 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* ── Cola offline ─────────────────────────────────────────── */}
                <View className="mx-4 mb-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-800 overflow-hidden">

                    {/* Cabecera — siempre visible, toca para expandir */}
                    <TouchableOpacity
                        onPress={() => setColaExpandida(v => !v)}
                        activeOpacity={0.7}
                        className="flex-row items-center px-5 py-4"
                    >
                        <View className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/50 items-center justify-center mr-3">
                            <Ionicons name="cloud-upload-outline" size={20} color="#b45309" />
                        </View>

                        <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                Pendientes de sincronizar
                            </Text>
                            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {pendientesCount === 0
                                    ? 'Todo sincronizado'
                                    : `${pendientesCount} elemento${pendientesCount > 1 ? 's' : ''} en cola`}
                            </Text>
                        </View>

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

                    {/* Cuerpo expandible */}
                    {colaExpandida && (
                        <View className="border-t border-gray-100 dark:border-gray-700">
                            {pendientesCount === 0 ? (

                                /* Estado vacío */
                                <View className="items-center py-8 px-6">
                                    <View className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 items-center justify-center mb-3">
                                        <Ionicons name="checkmark-circle-outline" size={32} color="#16a34a" />
                                    </View>
                                    <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 text-center">
                                        Todo al día
                                    </Text>
                                    <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                                        No hay elementos esperando sincronización
                                    </Text>
                                </View>

                            ) : (
                                <View>
                                    {/* ── ScrollView INTERNO con altura fija ──────────────
                                        maxHeight 320 ≈ 4 items visibles.
                                        nestedScrollEnabled permite scrollear aquí sin
                                        interferir con el ScrollView exterior. */}
                                    <ScrollView
                                        style={{ maxHeight: 320 }}
                                        nestedScrollEnabled
                                        showsVerticalScrollIndicator
                                        contentContainerStyle={{ paddingBottom: 4 }}
                                    >
                                        {itemsCola.map((item, index) => {
                                            const payload = JSON.parse(item.payload) as Record<string, string>;
                                            const esUltimo = index === itemsCola.length - 1;

                                            return (
                                                <View
                                                    key={item.id}
                                                    className={`px-4 py-3 flex-row items-center ${!esUltimo ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                                                >
                                                    {/* Miniatura */}
                                                    <View className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 mr-3 overflow-hidden items-center justify-center flex-shrink-0">
                                                        {item.image_uri ? (
                                                            <Image
                                                                source={{ uri: item.image_uri }}
                                                                style={{ width: 48, height: 48 }}
                                                                resizeMode="cover"
                                                            />
                                                        ) : (
                                                            <Ionicons name="image-outline" size={20} color="#9ca3af" />
                                                        )}
                                                    </View>

                                                    {/* Info */}
                                                    <View className="flex-1 min-w-0">
                                                        <View className="flex-row items-center gap-1.5 mb-0.5">
                                                            <Ionicons
                                                                name={ICON_TIPO[item.tipo] as any}
                                                                size={12}
                                                                color="#b45309"
                                                            />
                                                            <Text className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                                                                {LABEL_TIPO[item.tipo]}
                                                            </Text>
                                                        </View>

                                                        <Text
                                                            className="text-xs text-gray-600 dark:text-gray-300"
                                                            numberOfLines={1}
                                                        >
                                                            {descripcionItem(item.tipo, payload)}
                                                        </Text>

                                                        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                            {formatearFecha(item.creado_en)}
                                                        </Text>

                                                        {item.intentos >= 3 && (
                                                            <View className="flex-row items-center gap-1 mt-0.5">
                                                                <Ionicons name="warning-outline" size={11} color="#dc2626" />
                                                                <Text className="text-xs text-red-500">
                                                                    {item.intentos} intentos fallidos
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    {/* Punto de estado */}
                                                    <View className="w-2 h-2 rounded-full bg-amber-400 ml-2 flex-shrink-0" />
                                                </View>
                                            );
                                        })}
                                    </ScrollView>

                                    {/* Botón sincronizar — siempre visible, fuera del scroll interno */}
                                    <TouchableOpacity
                                        onPress={handleSincronizarManual}
                                        disabled={sincronizando}
                                        activeOpacity={0.8}
                                        className={`mx-4 my-3 py-3 rounded-xl flex-row items-center justify-center gap-2 ${sincronizando ? 'bg-amber-300' : 'bg-amber-500'}`}
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

                {/* ── Opciones ─────────────────────────────────────────────── */}

                <View className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]">
                    <Ionicons name="moon-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Modo oscuro</Text>
                    <Switch
                        value={colorScheme === 'dark'}
                        onValueChange={(val) => setColorScheme(val ? 'dark' : 'light')}
                    />
                </View>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleRateApp}>
                    <Ionicons name="star-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Calificar app</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleShareApp}>
                    <Ionicons name="share-social-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Compartir app</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={() => openLink('https://tuapp.com/privacidad')}>
                    <Ionicons name="lock-closed-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Política de privacidad</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={() => openLink('https://tuapp.com/terminos')}>
                    <Ionicons name="document-text-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Términos y condiciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={() => openLink('https://tuapp.com/cookies')}>
                    <Ionicons name="document-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Política de cookies</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={() => openLink('mailto:contacto@tuapp.com')}>
                    <Ionicons name="mail-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Contacto</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={() => openLink('https://tuapp.com/feedback')}>
                    <Ionicons name="chatbox-ellipses-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Comentarios</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#e53935" />
                    <Text className="flex-1 ml-4 text-base text-[#e53935]">Cerrar sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
