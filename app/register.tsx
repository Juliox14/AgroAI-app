import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

const RegistroScreen = () => {
  const { colorScheme } = useColorScheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegistro = async () => {
    // 1. Validación inicial
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const url = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/auth/register`;

    try {
      // 2. Intento de petición al servidor
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: name, email, password })
      });

      // 3. Parsear el JSON (aquí es donde fallaba antes si la respuesta era inesperada)
      const data = await res.json();

      if (res.ok) {
        // Registro exitoso
        Alert.alert('Éxito', '¡Registro exitoso!');
        router.push("/login");
      } else {
        // Manejo de errores del servidor (400, 401, 500, etc.)
        // Buscamos el mensaje en varios lugares posibles del JSON
        const errorMsg = data?.mensaje || data?.body?.mensaje || 'Error al registrar el usuario';
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      // 4. Manejo de errores de red o del cliente
      console.error("Error en la petición:", error);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifica que tu API esté encendida y la IP sea correcta.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {/* Header con logo */}
          <View className="flex items-center justify-center mb-6 mt-4">
            <Image
              source={
                colorScheme === 'dark'
                  ? require('../assets/images/AgroAI-letters-dark.png')
                  : require('../assets/images/AgroAI-letters.png')
              }
              className="h-14 w-48"
              resizeMode="contain"
            />
          </View>

          {/* Contenido de registro */}
          <View className="p-4">
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-4">
              <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Registro de usuario</Text>

              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Nombre</Text>
                <View className="bg-gray-100 dark:bg-gray-700 rounded-lg flex-row items-center px-3 border border-gray-200 dark:border-gray-600">
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-gray-800 dark:text-gray-100"
                    placeholder="Ingresa tu nombre"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Correo electrónico</Text>
                <View className="bg-gray-100 dark:bg-gray-700 rounded-lg flex-row items-center px-3 border border-gray-200 dark:border-gray-600">
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-gray-800 dark:text-gray-100"
                    placeholder="Ingresa tu correo"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Contraseña</Text>
                <View className="bg-gray-100 dark:bg-gray-700 rounded-lg flex-row items-center px-3 border border-gray-200 dark:border-gray-600">
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-gray-800 dark:text-gray-100"
                    placeholder="Crea una contraseña"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="bg-green-700 rounded-lg py-4 items-center"
                onPress={handleRegistro}
              >
                <Text className="text-white font-bold text-lg">Crear cuenta</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm flex-row justify-center">
              <Text className="text-gray-600 dark:text-gray-400">¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-green-700 dark:text-green-400 font-medium">Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistroScreen;