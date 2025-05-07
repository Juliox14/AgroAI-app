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
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RegistroScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegistro = async() => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      Alert.alert('Éxito', 'Registro exitoso!');
      router.push("/login");
    } else {
      Alert.alert('Error', data.body.message);
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
          {/* Header con logo - Ajustado para estar más centrado y más grande */}
          <View className="flex items-center justify-center mb-6 mt-4">
            <Image 
              source={require('../assets/images/AgroAI-letters.png')} 
              className="h-14 w-48"
              resizeMode="contain"
            />
          </View>
          
          {/* Contenido de registro */}
          <View className="p-4">
            <View className="bg-white rounded-xl p-6 shadow-sm mb-4">
              <Text className="text-2xl font-bold text-gray-800 mb-6">Registro de usuario</Text>
              {/* Campo de name */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Nombre</Text>
                <View className="bg-gray-100 rounded-lg flex-row items-center px-3 border border-gray-200">
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <TextInput
                    className="flex-1 py-3 px-2 text-gray-800"
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
              
              {/* Campo de email */}
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
                    placeholder="Crea una contraseña"
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
            
            {/* Enlace para iniciar sesión */}
            <View className="bg-white rounded-xl p-6 shadow-sm flex-row justify-center">
              <Text className="text-gray-600">¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')} >
                <Text className="text-green-700 font-medium">Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistroScreen;