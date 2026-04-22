import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, Alert, Share, Linking } from 'react-native';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';
import LocationHeader from '@/components/home/LocationHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function ConfiguracionScreen() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [notificaciones, setNotificaciones] = useState(false);
    const [locationName, setLocationName] = useState('Cargando ubicación...');
    const { signOut } = useAuth();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se requiere ubicación.');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const [place] = await Location.reverseGeocodeAsync(loc.coords);

            // Abreviatura → nombre completo
            const rawState = place.region ?? '';
            const fullState = normalizarEstado(rawState);

            const mun = place.city || place.district || place.subregion || '';

            setLocationName(`${mun || '—'}, ${fullState || '—'}`);
        })();
    }, []);

    const handleRateApp = () => {
        const url = 'market://details?id=com.tuapp';
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'No se pudo abrir la tienda.')
        );
    };

    const handleShareApp = async () => {
        try {
            await Share.share({
                message:
                    'Mira AgroAI, la app que cuida tus cultivos multiespectrales: https://tuapp.link'
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
            {
                text: 'Salir',
                style: 'destructive',
                onPress: () => signOut(),
            },
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
            <View className='mt-8'>
            <LocationHeader locationName={locationName} />
            </View>
            <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>

                {/* Notificaciones
                <View style={styles.item}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                    <Text style={styles.label}>Notificaciones</Text>
                    <Switch
                        value={notificaciones}
                        onValueChange={setNotificaciones}
                    />
                </View> */}

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
                    onPress={() => openLink('https://tuapp.com/privacidad')}
                >
                    <Ionicons name="lock-closed-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Política de privacidad</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Términos y condiciones */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => openLink('https://tuapp.com/terminos')}
                >
                    <Ionicons name="document-text-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Términos y condiciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Política de cookies */}
                <TouchableOpacity
                    className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]"
                    onPress={() => openLink('https://tuapp.com/cookies')}
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
                    onPress={() => openLink('https://tuapp.com/feedback')}
                >
                    <Ionicons name="chatbox-ellipses-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
                    <Text className="flex-1 ml-4 text-base text-gray-800 dark:text-gray-100">Comentarios</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Cerrar sesión */}
                <TouchableOpacity className="flex-row items-center px-5 py-3.5 bg-white dark:bg-gray-800 mb-[1px]" onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#e53935" />
                    <Text className="flex-1 ml-4 text-base text-[#e53935]">
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
