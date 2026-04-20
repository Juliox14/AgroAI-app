import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import DateTimePicker from '@react-native-community/datetimepicker'; // 🟢 Nueva importación

export default function NuevaParcela() {
  const router = useRouter();
  const { token } = useAuth();
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [comunidadEjido, setComunidadEjido] = useState('');
  const [area, setArea] = useState('');
  const [tipoSistema, setTipoSistema] = useState('Milpa Tradicional');
  const [cultivosAsociados, setCultivosAsociados] = useState('');
  const [tipoRiego, setTipoRiego] = useState('Temporal');
  
  // 🟢 Nuevos estados para la fecha
  const [fechaSiembra, setFechaSiembra] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const opcionesSistema = ['Milpa Tradicional', 'Cafetal con Sombra', 'Huerto de Traspatio', 'Monocultivo', 'Otro'];
  const opcionesRiego = ['Temporal', 'Goteo', 'Gravedad/Rodado', 'Aspersión'];

  // 🟢 Manejador del cambio de fecha
  const onChangeDate = (event: any, selectedDate?: Date) => {
    // En Android el calendario se cierra solo, en iOS hay que cerrarlo manual
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setFechaSiembra(selectedDate);
    }
  };

  // Función para cerrar el picker en iOS
  const confirmarFechaIOS = () => {
    setShowDatePicker(false);
  }

  const handleGuardar = async () => {
    if (!nombre.trim() || !cultivosAsociados.trim()) {
      Alert.alert("Campos incompletos", "Por favor ingresa al menos el nombre de la parcela y los cultivos que tiene.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nombre,
          comunidad_ejido: comunidadEjido,
          area_metros_cuadrados: area ? parseFloat(area) : null,
          tipo_sistema: tipoSistema,
          cultivos_asociados: cultivosAsociados,
          tipo_riego: tipoRiego,
          fecha_siembra: fechaSiembra.toISOString() // 🟢 Enviamos la fecha formateada al backend
        })
      });

      const json = await res.json();

      if (json.success) {
        Alert.alert("¡Éxito!", "La parcela se ha registrado correctamente.", [
          { text: "OK", onPress: () => router.push('/(tabs)/parcelas') }
        ]);
      } else {
        Alert.alert("Error", json.message || "No se pudo guardar la parcela.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error de red", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <BackButton />
        <Text className="text-xl font-bold ml-4 text-green-900">Registrar Parcela</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN 1: Datos Básicos */}
        <Text className="text-gray-500 font-bold uppercase text-xs mb-3">Información Principal</Text>
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-700 font-medium mb-1">Nombre del Terreno/Milpa *</Text>
          <TextInput 
            className="border border-gray-300 rounded-xl p-3 text-gray-800 mb-4 bg-gray-50"
            placeholder="Ej. El terreno de arriba"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text className="text-gray-700 font-medium mb-1">Comunidad o Ejido</Text>
          <TextInput 
            className="border border-gray-300 rounded-xl p-3 text-gray-800 mb-4 bg-gray-50"
            placeholder="Ej. Ejido San José"
            value={comunidadEjido}
            onChangeText={setComunidadEjido}
          />

          <Text className="text-gray-700 font-medium mb-1">Área aproximada (Metros Cuadrados)</Text>
          <TextInput 
            className="border border-gray-300 rounded-xl p-3 text-gray-800 bg-gray-50"
            placeholder="Ej. 5000"
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />
        </View>

        {/* SECCIÓN 2: Detalles Agrícolas */}
        <Text className="text-gray-500 font-bold uppercase text-xs mb-3">Detalles de Siembra</Text>
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
          
          <Text className="text-gray-700 font-medium mb-2">Tipo de Sistema Agrícola</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {opcionesSistema.map((opcion) => (
              <TouchableOpacity 
                key={opcion}
                onPress={() => setTipoSistema(opcion)}
                className={`px-3 py-2 rounded-lg border ${tipoSistema === opcion ? 'bg-green-100 border-green-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={tipoSistema === opcion ? 'text-green-800 font-medium' : 'text-gray-500'}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-700 font-medium mb-1">Cultivos Asociados (Plantas) *</Text>
          <TextInput 
            className="border border-gray-300 rounded-xl p-3 text-gray-800 mb-4 bg-gray-50"
            placeholder="Ej. Maíz, frijol y calabaza"
            value={cultivosAsociados}
            onChangeText={setCultivosAsociados}
          />

          <Text className="text-gray-700 font-medium mb-2">Método de Riego</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {opcionesRiego.map((opcion) => (
              <TouchableOpacity 
                key={opcion}
                onPress={() => setTipoRiego(opcion)}
                className={`px-3 py-2 rounded-lg border ${tipoRiego === opcion ? 'bg-blue-100 border-blue-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={tipoRiego === opcion ? 'text-blue-800 font-medium' : 'text-gray-500'}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🟢 Selector de Fecha de Siembra */}
          <Text className="text-gray-700 font-medium mb-2">Fecha de Siembra</Text>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center border border-gray-300 bg-gray-50 rounded-xl p-3"
          >
            <Ionicons name="calendar-outline" size={20} color="#4B5563" />
            <Text className="ml-2 text-gray-800">
              {fechaSiembra.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </TouchableOpacity>

          {/* Renderizado condicional del DatePicker */}
          {showDatePicker && (
            <View className={Platform.OS === 'ios' ? "mt-2 bg-white rounded-xl p-2" : ""}>
              <DateTimePicker
                value={fechaSiembra}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()} // No dejar seleccionar fechas futuras
                textColor="#15803d" // Verde para iOS
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={confirmarFechaIOS} className="mt-2 bg-green-100 py-2 rounded-lg items-center">
                  <Text className="text-green-800 font-bold">Confirmar Fecha</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

        </View>

        {/* Botón de Guardar */}
        <TouchableOpacity 
          onPress={handleGuardar}
          disabled={loading}
          className={`flex-row justify-center items-center py-4 rounded-xl shadow-sm mb-10 ${loading ? 'bg-green-400' : 'bg-green-700'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="save-outline" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Guardar Parcela</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}