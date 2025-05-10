import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Switch, TouchableOpacity, StyleSheet, Alert, Share, Linking } from 'react-native';
import { normalizarEstado } from '@/utils/normalizarEstado';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';
import LocationHeader from '@/components/home/LocationHeader';

export default function ConfiguracionScreen() {
    const [notificaciones, setNotificaciones] = useState(false);
    const [modoOscuro, setModoOscuro] = useState(false);
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
        <SafeAreaView style={styles.container}>
            <LocationHeader locationName={locationName} />
            <ScrollView contentContainerStyle={styles.content}>

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
                <View style={styles.item}>
                    <Ionicons name="moon-outline" size={24} color="#333" />
                    <Text style={styles.label}>Modo oscuro</Text>
                    <Switch
                        value={modoOscuro}
                        onValueChange={setModoOscuro}
                    />
                </View>

                {/* Calificar app */}
                <TouchableOpacity style={styles.item} onPress={handleRateApp}>
                    <Ionicons name="star-outline" size={24} color="#333" />
                    <Text style={styles.label}>Calificar app</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Compartir app */}
                <TouchableOpacity style={styles.item} onPress={handleShareApp}>
                    <Ionicons name="share-social-outline" size={24} color="#333" />
                    <Text style={styles.label}>Compartir app</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Política de privacidad */}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => openLink('https://tuapp.com/privacidad')}
                >
                    <Ionicons name="lock-closed-outline" size={24} color="#333" />
                    <Text style={styles.label}>Política de privacidad</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Términos y condiciones */}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => openLink('https://tuapp.com/terminos')}
                >
                    <Ionicons name="document-text-outline" size={24} color="#333" />
                    <Text style={styles.label}>Términos y condiciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Política de cookies */}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => openLink('https://tuapp.com/cookies')}
                >
                    <Ionicons name="document-outline" size={24} color="#333" />
                    <Text style={styles.label}>Política de cookies</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Contacto */}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => openLink('mailto:contacto@tuapp.com')}
                >
                    <Ionicons name="mail-outline" size={24} color="#333" />
                    <Text style={styles.label}>Contacto</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Comentarios */}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => openLink('https://tuapp.com/feedback')}
                >
                    <Ionicons name="chatbox-ellipses-outline" size={24} color="#333" />
                    <Text style={styles.label}>Comentarios</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                {/* Cerrar sesión */}
                <TouchableOpacity style={styles.item} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#e53935" />
                    <Text style={[styles.label, { color: '#e53935' }]}>
                        Cerrar sesión
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { paddingVertical: 16 },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: 'white',
        marginBottom: 1
    },
    label: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        color: '#333'
    }
});
