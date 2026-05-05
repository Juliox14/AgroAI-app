// React
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Types
import { SettingsresultsProps } from "@/interfaces/components";

// Components
import RectangleRounded from './RectagleRounded';
import CustomModal from './CustomModal';
import { Picker } from "@react-native-picker/picker";

// Functions
import { createFileFromBase64 } from '@/utils/general';

// Edge computing — cola offline
import NetInfo from '@react-native-community/netinfo';
import { encolarItem } from '@/utils/db';

export default function SettingsResults({ expedientes, plants, payload, stats, imageBase64 }: SettingsresultsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(plants ? (plants[0].id_planta).toString() : "3");
  const [modalForm, setModalForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Expedientes", plants);
  }, [])

  const handleSubmitResults = async (id_expediente: number) => {
    if (!expedientes) return;

    const expediente = expedientes.find((e) => e.id_expediente === id_expediente);
    if (!expediente) {
      Alert.alert('Error', "No se encontró el expediente seleccionado");
      return;
    }

    try {
      const blob = await createFileFromBase64(imageBase64);
      const red = await NetInfo.fetch();

      const camposPayload = {
        nombre:        expediente.planta.name,
        id_expediente: expediente.id_expediente.toString(),
        healthy:       stats.healthy_percentage.toString(),
        stressed:      stats.stressed_percentage.toString(),
        dry:           stats.dry_percentage.toString(),
        anomaly:       stats.anomaly_percentage.toString(),
      };

      if (red.isConnected) {
        // ── Con internet: enviar directo al backend ──
        const formData = new FormData();
        formData.append("file", blob as unknown as Blob);
        for (const [k, v] of Object.entries(camposPayload)) {
          formData.append(k, v);
        }

        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/registrar`,
          { method: 'POST', body: formData }
        );

        if (!response.ok) {
          Alert.alert('Error', "Error al comunicarse con el servicio, inténtalo más tarde");
          return;
        }

        Alert.alert('Éxito', "Expediente actualizado con éxito, se redirigirá a la pantalla principal");

      } else {
        // ── Sin internet: encolar en SQLite ──
        const tempUri = (blob as any).uri ?? '';
        encolarItem('registro', camposPayload, tempUri);

        Alert.alert(
          'Guardado sin conexión',
          'Se enviará automáticamente cuando haya conexión a internet'
        );
      }

      setTimeout(() => router.push("/(tabs)"), 2000);

    } catch (error) {
      console.error("Error al llamar al microservicio:", error);
      Alert.alert('Error', "Error al comunicarse con el microservicio");
    }
  }

  const handleSubmitNewExpediente = async () => {
    if (!selectedPlant || !payload) return;

    const plant = plants?.find(p => p.id_planta === parseInt(selectedPlant));
    if (!plant) {
      Alert.alert('Error', "No se encontró la planta seleccionada");
      return;
    }

    try {
      const blob = await createFileFromBase64(imageBase64);
      const red = await NetInfo.fetch();

      const camposPayload = {
        id_usuario:    payload.id.toString(),
        id_planta:     selectedPlant,
        nombre_imagen: plant.name,
        healthy:       stats.healthy_percentage.toString(),
        stressed:      stats.stressed_percentage.toString(),
        dry:           stats.dry_percentage.toString(),
        anomaly:       stats.anomaly_percentage.toString(),
      };

      if (red.isConnected) {
        // ── Con internet: enviar directo al backend ──
        const formData = new FormData();
        formData.append("file", blob as unknown as Blob);
        for (const [k, v] of Object.entries(camposPayload)) {
          formData.append(k, v);
        }

        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/postExpedientes`,
          { method: 'POST', body: formData }
        );

        if (!response.ok) {
          Alert.alert('Error', "Error al comunicarse con el servicio, inténtalo más tarde");
          return;
        }

        Alert.alert('Éxito', "Expediente creado con éxito, se redirigirá a la pantalla principal");

      } else {
        // ── Sin internet: encolar en SQLite ──
        const tempUri = (blob as any).uri ?? '';
        encolarItem('nuevo_expediente', camposPayload, tempUri);

        Alert.alert(
          'Guardado sin conexión',
          'Se enviará automáticamente cuando haya conexión a internet'
        );
      }

      setTimeout(() => router.push("/(tabs)"), 2000);

    } catch (error) {
      console.error("Error al crear expediente:", error);
      Alert.alert('Error', "Error al comunicarse con el microservicio");
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className='flex gap-6'>
        <Text className='text-2xl text-center text-shadow-sky-300'>¿Qué harás con estos datos?</Text>
        <View className="gap-4">
          <RectangleRounded handleDecision={() => setModalVisible(true)} icon="bookmark-outline" text="Insertar datos en un expediente existente" />
          <RectangleRounded handleDecision={() => setModalForm(true)} icon="folder-outline" text="Crear un nuevo expediente" />
          <RectangleRounded handleDecision={() => router.push('/(tabs)')} icon="ban-outline" text="No guardar los datos" />

          {/* ── Modal: elegir expediente existente ── */}
          <CustomModal modalVisible={modalVisible} setModalHidden={() => setModalVisible(false)}>
            <View>
              {!expedientes && (
                <View className="h-screen justify-center items-center">
                  <Text className="text-lg text-center font-medium pb-[15%]">No hay expedientes por mostrar</Text>
                </View>
              )}
              {expedientes && (
                <View className="h-screen">
                  <ScrollView>
                    <Text className="text-2xl text-center font-semibold mt-20 mb-4">Elige tu expediente</Text>
                    <View className="px-10 pb-10 gap-2">
                      {expedientes.map((expediente) => (
                        <TouchableOpacity
                          key={expediente.id_expediente}
                          onPress={() => handleSubmitResults(expediente.id_expediente)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between"
                          activeOpacity={0.7}
                        >
                          <View className="flex-1">
                            <Text className="text-base font-semibold text-gray-800">
                              {expediente.planta.name}
                            </Text>
                            <Text className="text-xs text-gray-500 italic mt-0.5">
                              {expediente.planta.nombre_cientifico}
                            </Text>
                            <View className="flex-row gap-3 mt-2">
                              <Text className="text-xs text-green-700">
                                Sano: {expediente.ultimo_registro.healthy}%
                              </Text>
                              <Text className="text-xs text-yellow-600">
                                Estrés: {expediente.ultimo_registro.stressed}%
                              </Text>
                              <Text className="text-xs text-red-500">
                                Seco: {expediente.ultimo_registro.dry}%
                              </Text>
                            </View>
                          </View>
                          <Text className="text-green-600 font-semibold text-sm ml-2">Elegir</Text>
                        </TouchableOpacity>
                      ))}
                      <View className="h-10" />
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </CustomModal>

          {/* ── Modal: nuevo expediente ── */}
          <CustomModal modalVisible={modalForm} setModalHidden={() => setModalForm(false)}>
            <View className="p-6">
              <Text className="text-2xl text-center font-semibold mt-10 mb-6">Nuevo expediente</Text>
              <Text className="text-sm text-gray-600 mb-2">Selecciona la planta:</Text>
              <Picker
                selectedValue={selectedPlant}
                onValueChange={(value) => setSelectedPlant(value)}
              >
                {plants?.map(plant => (
                  <Picker.Item
                    key={plant.id_planta}
                    label={plant.name}
                    value={plant.id_planta.toString()}
                  />
                ))}
              </Picker>
              <TouchableOpacity
                onPress={handleSubmitNewExpediente}
                className="bg-green-700 rounded-xl py-4 items-center mt-6"
                activeOpacity={0.85}
              >
                <Text className="text-white font-bold text-base">Crear expediente</Text>
              </TouchableOpacity>
            </View>
          </CustomModal>

        </View>
      </View>
    </View>
  );
}