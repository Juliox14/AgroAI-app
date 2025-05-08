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

const LoginScreen = () => {
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
            {/* Header con logo - Perfectamente centrado y más grande */}
            <View style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              marginTop: 16
            }}>
              <Image 
                source={require('../assets/images/AgroAI-letters.png')} 
                style={{
                  height: 56,
                  width: 192,
                  alignSelf: 'center'
                }}
                resizeMode="contain"
              />
            </View>
            
            {/* Contenido de registro */}
            <View className="p-4">
              <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
                <Text className="text-2xl font-bold text-gray-800 mb-6">Iniciar sesión</Text>
                {/* Campo de correo */}
                <View className="mb-4">
                  <Text className="text-gray-700 mb-2 font-medium">Correo electrónico</Text>
                  <View className="bg-gray-100 rounded-lg flex-row items-center px-3 border border-gray-200">
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <TextInput
                      className="flex-1 py-3 px-2 text-gray-800"
                      placeholder="Ingresa tu correo"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                
                {/* Campo de contraseña */}
                <View className="mb-6">
                  <Text className="text-gray-700 mb-2 font-medium">Contraseña</Text>
                  <View className="bg-gray-100 rounded-lg flex-row items-center px-3 border border-gray-200">
                    <Ionicons name="lock-closed-outline" size={20} color="#666" />
                    <TextInput
                      className="flex-1 py-3 px-2 text-gray-800"
                      placeholder="Ingresa tu contraseña"
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
              
              {/* Enlace para iniciar sesión */}
              <View className="bg-white rounded-xl p-6 shadow-sm flex-row justify-center">
                <Text className="text-gray-600">¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/register")} >
                  <Text className="text-green-700 font-medium">Registrate</Text>
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