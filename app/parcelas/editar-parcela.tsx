import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import { encolarItem } from '@/utils/db';

export default function EditarParcela() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  // ── Estado de carga inicial ──────────────────────────────────────────────
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // ── Campos del formulario ────────────────────────────────────────────────
  const [nombre, setNombre] = useState('');
  const [comunidadEjido, setComunidadEjido] = useState('');
  const [area, setArea] = useState('');
  const [tipoSistema, setTipoSistema] = useState('Milpa Tradicional');
  const [cultivosAsociados, setCultivosAsociados] = useState('');
  const [tipoRiego, setTipoRiego] = useState('Temporal');
  const [fechaSiembra, setFechaSiembra] = useState(new Date());
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [imagenOriginalUrl, setImagenOriginalUrl] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const opcionesSistema = ['Milpa Tradicional', 'Cafetal con Sombra', 'Huerto de Traspatio', 'Monocultivo', 'Otro'];
  const opcionesRiego = ['Temporal', 'Goteo', 'Gravedad/Rodado', 'Aspersión'];

  // ── Cargar datos actuales de la parcela ──────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const cargarParcela = async () => {
      try {
        const res = await fetch(
          `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();

        if (json.success && json.data) {
          const p = json.data;
          setNombre(p.nombre ?? '');
          setComunidadEjido(p.comunidad_ejido ?? '');
          setArea(p.area_metros_cuadrados?.toString() ?? '');
          setTipoSistema(p.tipo_sistema ?? 'Milpa Tradicional');
          setCultivosAsociados(p.cultivos_asociados ?? '');
          setTipoRiego(p.tipo_riego ?? 'Temporal');
          if (p.fecha_siembra) setFechaSiembra(new Date(p.fecha_siembra));
          if (p.imagen_url) setImagenOriginalUrl(p.imagen_url);
        } else {
          Alert.alert('Error', 'No se pudo cargar la parcela.');
          router.back();
        }
      } catch {
        Alert.alert('Sin conexión', 'No se pudo cargar la parcela. Revisa tu red local.');
        router.back();
      } finally {
        setCargando(false);
      }
    };

    cargarParcela();
  }, [id]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setFechaSiembra(selectedDate);
  };

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !cultivosAsociados.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa al menos el nombre y los cultivos.');
      return;
    }

    setGuardando(true);

    try {
      const red = await NetInfo.fetch();

      const camposPayload: Record<string, string> = {
        id: id!,
        nombre,
        comunidad_ejido: comunidadEjido,
        area_metros_cuadrados: area || '',
        tipo_sistema: tipoSistema,
        cultivos_asociados: cultivosAsociados,
        tipo_riego: tipoRiego,
        fecha_siembra: fechaSiembra.toISOString(),
      };

      if (red.isConnected) {
  let res;

  if (imagenUri) {
    // Con imagen: multipart/form-data
    const formData = new FormData();
    for (const [k, v] of Object.entries(camposPayload)) {
      if (v !== null && v !== undefined) formData.append(k, String(v));
    }
    formData.append('imagen', {
      uri: imagenUri,
      name: 'portada_parcela.jpg',
      type: 'image/jpeg',
    } as any);

    res = await fetch(
      `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas/${id}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
  } else {
    // Sin imagen: JSON normal
    res = await fetch(
      `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/parcelas/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(camposPayload),
      }
    );
  }

  const texto = await res.text();
  let json: any = {};
  try {
    json = JSON.parse(texto);
  } catch {
    Alert.alert('Error', `El servidor no devolvió JSON:\n${texto.slice(0, 200)}`);
    return;
  }

  if (json.success) {
    Alert.alert('¡Guardado!', 'La parcela se actualizó correctamente.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  } else {
    Alert.alert('Error', json.message || 'No se pudo actualizar la parcela.');
  }


      } else {
        // ── Sin internet: encolar en SQLite ───────────────────────────
        encolarItem('editar_parcela', camposPayload, imagenUri ?? '');

        Alert.alert(
          'Guardado sin conexión',
          'Los cambios se aplicarán automáticamente cuando haya internet.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un problema al guardar los cambios.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Splash de carga ──────────────────────────────────────────────────────
  if (cargando) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-400 mt-3 text-sm">Cargando parcela...</Text>
      </SafeAreaView>
    );
  }

  // ── Imagen a mostrar: nueva seleccionada > URL original > placeholder ────
  const imagenMostrar = imagenUri ?? imagenOriginalUrl;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">

      {/* ── Header ── */}
      <View className="px-5 py-4 flex-row items-center bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <BackButton />
        <View className="ml-3">
          <Text className="text-lg font-bold text-green-950 dark:text-gray-100 tracking-tight">Editar Parcela</Text>
          <Text className="text-xs font-medium text-green-400 dark:text-green-300 mt-0.5">Modifica los datos de tu milpa</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>

        {/* ── Sección 1 ── */}
        <SectionLabel icon="leaf-outline" label="Información Principal" />

        <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-6 shadow-sm">

          {/* Foto */}
          <FieldLabel text="Foto de la Parcela" />
          <TouchableOpacity
            onPress={seleccionarImagen}
            className="mb-6 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 items-center justify-center h-40"
          >
            {imagenMostrar ? (
              <>
                <Image source={{ uri: imagenMostrar }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute bg-black/50 p-2 rounded-full">
                  <Ionicons name="camera-reverse" size={20} color="white" />
                </View>
                {imagenUri && (
                  <View className="absolute top-2 right-2 bg-green-600 px-2 py-0.5 rounded-full">
                    <Text className="text-white text-xs font-semibold">Nueva</Text>
                  </View>
                )}
              </>
            ) : (
              <View className="items-center justify-center">
                <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                <Text className="text-gray-400 font-medium mt-2">Toca para cambiar la foto</Text>
              </View>
            )}
          </TouchableOpacity>

          <FieldLabel text="Nombre del Terreno / Milpa" required />
          <TextInput
            className="border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-green-950 dark:text-gray-100 bg-white dark:bg-gray-800 mb-4"
            placeholder="Ej. El terreno de arriba"
            placeholderTextColor="#9CA3AF"
            value={nombre}
            onChangeText={setNombre}
          />

          <FieldLabel text="Comunidad o Ejido" />
          <TextInput
            className="border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-green-950 dark:text-gray-100 bg-white dark:bg-gray-800 mb-4"
            placeholder="Ej. Ejido San José"
            placeholderTextColor="#9CA3AF"
            value={comunidadEjido}
            onChangeText={setComunidadEjido}
          />

          <FieldLabel text="Área aproximada (m²)" />
          <TextInput
            className="border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-green-950 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder="Ej. 5000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />
        </View>

        {/* ── Sección 2 ── */}
        <SectionLabel icon="nutrition-outline" label="Detalles de Siembra" />

        <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-8 shadow-sm">

          <FieldLabel text="Tipo de Sistema Agrícola" />
          <View className="flex-row flex-wrap gap-2 mb-5">
            {opcionesSistema.map((opcion) => {
              const active = tipoSistema === opcion;
              return (
                <TouchableOpacity
                  key={opcion}
                  onPress={() => setTipoSistema(opcion)}
                  className={`px-4 py-2 rounded-full border-2 ${active
                    ? 'bg-green-100 dark:bg-green-900 border-green-500'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-sm ${active
                    ? 'text-green-800 dark:text-green-300 font-semibold'
                    : 'text-gray-400 dark:text-gray-300'}`}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <FieldLabel text="Cultivos Asociados (Plantas)" required />
          <TextInput
            className="border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-green-950 dark:text-gray-100 bg-white dark:bg-gray-800 mb-4"
            placeholder="Ej. Maíz, frijol y calabaza"
            placeholderTextColor="#9CA3AF"
            value={cultivosAsociados}
            onChangeText={setCultivosAsociados}
          />

          <FieldLabel text="Método de Riego" />
          <View className="flex-row flex-wrap gap-2 mb-5">
            {opcionesRiego.map((opcion) => {
              const active = tipoRiego === opcion;
              return (
                <TouchableOpacity
                  key={opcion}
                  onPress={() => setTipoRiego(opcion)}
                  className={`px-4 py-2 rounded-full border-2 ${active
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                    : 'bg-blue-50 dark:bg-gray-800 border-blue-100 dark:border-gray-700'}`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-sm ${active
                    ? 'text-blue-800 dark:text-blue-300 font-semibold'
                    : 'text-gray-400 dark:text-gray-300'}`}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <FieldLabel text="Fecha de Siembra" />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center border-2 border-gray-100 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800"
            activeOpacity={0.7}
          >
            <View className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900 items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={18} color="#15803D" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium text-green-400 dark:text-green-300">Fecha seleccionada</Text>
              <Text className="text-sm font-semibold text-green-950 dark:text-gray-100 mt-0.5">
                {fechaSiembra.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#A7F3D0" />
          </TouchableOpacity>

          {showDatePicker && (
            <View className={Platform.OS === 'ios' ? 'mt-3 bg-white rounded-2xl border border-gray-100 p-2' : 'mt-2'}>
              <DateTimePicker
                value={fechaSiembra}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()}
                textColor="#15803d"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  className="mt-2 bg-green-100 py-3 rounded-xl items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-green-800 font-bold text-sm">Confirmar Fecha</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* ── Botón Guardar cambios ── */}
        <TouchableOpacity
          onPress={handleGuardar}
          disabled={guardando}
          className={`flex-row justify-center items-center py-4 rounded-2xl mb-10 ${guardando ? 'bg-green-400' : 'bg-green-700'}`}
          activeOpacity={0.85}
          style={{ shadowColor: '#14532D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 }}
        >
          {guardando ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <View className="w-9 h-9 rounded-xl bg-white/20 items-center justify-center mr-3">
                <Ionicons name="checkmark-done-outline" size={20} color="white" />
              </View>
              <Text className="text-white font-bold text-base tracking-wide">Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 mb-2.5">
      <Ionicons name={icon as any} size={12} color="#6EE7B7" />
      <Text className="text-xs font-bold tracking-widest text-green-300 uppercase">{label}</Text>
    </View>
  );
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <View className="flex-row mb-1.5">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">{text}</Text>
      {required && <Text className="text-sm text-green-600 ml-0.5">*</Text>}
    </View>
  );
}