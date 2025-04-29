import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';

interface Props {
    onClose: () => void;
}

// Precargar imágenes
const preloadImages = [
    require('../../assets/images/AgroAI-letters.png'),
    require('../../assets/images/no_filter.jpeg'),
    require('../../assets/images/blue_filter.jpeg'),
    require('../../assets/images/ir_filter.jpeg'),
    require('../../assets/images/incorrecta1.jpeg'),
    require('../../assets/images/incorrecta2.jpeg'),
    require('../../assets/images/correcta.jpeg'),
];

const FlujoCaptura = ({ onClose }: Props) => {
    const [pantallaActual, setPantallaActual] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Precargar imágenes al montar el componente
        preloadImages.forEach((img) => {
            const { uri } = Image.resolveAssetSource(img);
            Image.prefetch(uri);
        });
    }, []);

    const cambiarPantalla = (nuevaPantalla: number) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setPantallaActual(nuevaPantalla);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <View className="bg-white rounded-xl p-8 shadow-lg w-11/12">

            {/* Botón de Cerrar */}
            <View className="absolute top-2 right-2">
                <Ionicons name="close-outline" size={24} color="#000" onPress={onClose} />
            </View>

            {/* Título */}
            <Text className="text-center text-lg font-bold text-gray-800 mb-6">
                Instrucciones de captura multiespectral
            </Text>

            {/* Contenido animado */}
            <Animated.View style={{ opacity: fadeAnim, zIndex: 1000 }}>

                {pantallaActual === 0 ? (
                    <View className="items-center max-h-[355px]">
                        <Text className="text-center text-sm text-gray-600 mb-8">
                            La cámara de
                            <Image source={require('../../assets/images/AgroAI-letters.png')} className="w-16 h-3 px-2 pt-1" />
                            es simple y eficiente. Cuando captures cada foto con el filtro correspondiente, el dispositivo adaptado a tu teléfono activará automáticamente un servomotor que cambiará el filtro físico frente al lente.
                        </Text>

                        <View className="flex-row justify-around items-start mb-8">

                            <View className="w-24 items-center">
                                <Text className="text-3xl font-bold text-green-500 mb-2">1</Text>
                                <Image
                                    source={require('../../assets/images/no_filter.jpeg')}
                                    className="w-16 h-16 mb-2 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-center font-semibold text-gray-800">
                                    Captura sin filtro
                                </Text>
                                <Text className="text-center text-xs text-gray-500 mt-1">
                                    Toma una foto normal sin filtros.
                                </Text>
                            </View>

                            <View className="w-px h-24 bg-gray-300 mx-2" />

                            <View className="w-24 items-center">
                                <Text className="text-3xl font-bold text-blue-500 mb-2">2</Text>
                                <Image
                                    source={require('../../assets/images/blue_filter.jpeg')}
                                    className="w-16 h-16 mb-2 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-center font-semibold text-gray-800">
                                    Filtro Azul
                                </Text>
                                <Text className="text-center text-xs text-gray-500 mt-1">
                                    Coloca el filtro azul y toma otra foto.
                                </Text>
                            </View>

                            <View className="w-px h-24 bg-gray-300 mx-2" />

                            <View className="w-24 items-center">
                                <Text className="text-3xl font-bold text-purple-500 mb-2">3</Text>
                                <Image
                                    source={require('../../assets/images/ir_filter.jpeg')}
                                    className="w-16 h-16 mb-2 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-center font-semibold text-gray-800">
                                    Filtro Infrarrojo
                                </Text>
                                <Text className="text-center text-xs text-gray-500 mt-1">
                                    Coloca el filtro IR y captura la tercera imagen.
                                </Text>
                            </View>
                        </View>
                    </View>


                ) : (
                    // Segunda pantalla: Ejemplos correctos/incorrectos
                    <View className='items-center min-h-[355px]'>
                        <Text className="text-center text-base  text-gray-800 mb-6">
                            Observa los ejemplos de cómo tomar la foto, para que el modelo funcione correctamente.
                        </Text>

                        <View className="flex-row justify-around items-center">
                            {/* Imagen Incorrecta 1 */}
                            <View className="items-center">
                                <Ionicons name="close-circle" size={32} color="red" />
                                <Image
                                    source={require('../../assets/images/incorrecta2.jpeg')}
                                    className="h-48 w-24 mt-2 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-center text-xs text-red-500 mt-1">
                                    Mal encuadre
                                </Text>
                            </View>

                            {/* Imagen Incorrecta 2 */}
                            <View className="items-center">
                                <Ionicons name="close-circle" size={32} color="red" />
                                <Image
                                    source={require('../../assets/images/incorrecta1.jpeg')}
                                    className="h-48 w-24 mt-2 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-center text-xs text-red-500 mt-1">
                                    Parte de la planta fuera
                                </Text>
                            </View>

                            {/* Imagen Correcta */}
                            <View className="items-center">
                                <Ionicons name="checkmark-circle" size={32} color="green" />
                                <Image
                                    source={require('../../assets/images/correcta.jpeg')}
                                    className="h-48 w-24 mt-2 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-center text-xs text-green-500 mt-1">
                                    Correcto
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

            </Animated.View>

            {/* Botones de navegación */}
            <View className="flex-row justify-between items-center mt-8">

                {pantallaActual > 0 && (
                    <View className='justify-between w-full flex-row items-center'>
                        <TouchableOpacity onPress={() => cambiarPantalla(pantallaActual - 1)}>
                            <Text className="text-gray-400 font-semibold">Anterior</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} className="ml-4">
                            <Text className="text-green-600 font-semibold">Entendido</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {pantallaActual < 1 && (
                    <TouchableOpacity onPress={() => cambiarPantalla(pantallaActual + 1)} className="ml-auto">
                        <Text className="text-green-600 font-semibold">Siguiente</Text>
                    </TouchableOpacity>
                )}

            </View>

        </View>
    );
};

export default FlujoCaptura;
