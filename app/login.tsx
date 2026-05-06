// LoginScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

const LoginScreen = () => {
  const { colorScheme } = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { session, signIn, loading } = useAuth();

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Fallo el inicio de sesión, intente más tarde');
    }
  };

  return (
    <>
      {session ? <Redirect href={"/"} /> : (
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
              <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                marginTop: 16
              }}>
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

              <View className="p-4">
                <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-4">
                  <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Iniciar sesión</Text>

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
                        placeholder="Ingresa tu contraseña"
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
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Text className="text-white font-bold text-lg">
                      {loading ? 'Cargando...' : 'Iniciar sesión'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm flex-row justify-center">
                  <Text className="text-gray-600 dark:text-gray-400">¿No tienes cuenta? </Text>
                  <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text className="text-green-700 dark:text-green-400 font-medium">Registrate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>);
};

export default LoginScreen;