// React
import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Types
import { SettingsresultsProps } from "@/interfaces/components";

// Components
import PlantaCard from './PlantaCard';
import RectangleRounded from './RectagleRounded';
import CustomModal from './CustomModal';
import { Picker } from "@react-native-picker/picker";

// Functions
import { createFileFromBase64 } from '@/utils/general';

export default function SettingsResults({ expedientes, plants, payload, stats, imageBase64 }:SettingsresultsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState();
  const [modalForm, setModalForm] = useState(false);
  const router = useRouter();

  const handleSubmitResults = async(id_expediente: number) => {
    if (!expedientes)
      return;
  
    const expediente = expedientes.find((expediente) => expediente.id_expediente === id_expediente);
    if (!expediente) {
      Alert.alert('Error', "No se encontró el expediente seleccionado");
      return;
    }

    try{
      const blob = await createFileFromBase64(imageBase64);
      const formData = new FormData();

      console.log("ID Expediente", id_expediente);
      formData.append("file", blob as unknown as Blob);
      formData.append("nombre", expediente.planta.name);
      formData.append("id_expediente", expediente.id_expediente.toString());
      formData.append("healthy", stats.healthy_percentage.toString());
      formData.append("stressed", stats.stressed_percentage.toString());
      formData.append("dry", stats.dry_percentage.toString());
      formData.append("anomaly", stats.anomaly_percentage.toString());

      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/registrar`, {
        method: 'POST',
        body: formData
      });

      if(!response.ok){
        Alert.alert('Error', "Error al comunicarse con el servicio, intentalo más tarde");
        return;
      }

      // Aquí pondre un toast de éxito

      setTimeout(() => {
        router.push("/(tabs)");
      }, 2000);

    }catch (error) {
      console.error("Error al llamar al microservicio:", error);
      Alert.alert('Error', "Error al comunicarse con el microservicio");
      return;
    }
  }

  const handleSubmitNewExpediente = async() => {

    if (!selectedPlant || !payload)
      return;

    console.log("ID Planta", selectedPlant);
    const plant = plants?.find( p => p.id_planta === selectedPlant )

    if (!plant) {
      Alert.alert('Error', "No se encontró la planta seleccionada");
      return;
    }

    const blob = await createFileFromBase64(imageBase64);
    const formData = new FormData();

    formData.append("file", blob as unknown as Blob);
    formData.append("id_usuario", payload?.id.toString());
    formData.append("id_planta", selectedPlant);
    formData.append("nombre_imagen", plant?.name);
    formData.append("healthy", stats.healthy_percentage.toString());
    formData.append("stressed", stats.stressed_percentage.toString());
    formData.append("dry", stats.dry_percentage.toString());
    formData.append("anomaly", stats.anomaly_percentage.toString());

    const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/postExpedientes`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      Alert.alert('Error', "Error al comunicarse con el servicio, intentalo más tarde");
      return;
    }

    // Aquí pondre un toast de éxito

    setTimeout(() => {
      router.push("/(tabs)");
    }, 2000);
  }

  return (
    <View className="flex-1 bg-white">
      <View className='flex gap-6'>
        <Text className='text-2xl text-center text-shadow-sky-300'>¿Qué haras con estos datos?</Text>
        <View className="gap-4">
          <RectangleRounded handleDecision={() => setModalVisible(true)} icon="bookmark-outline" text="Insertar datos en un expediente existente"/>
          <RectangleRounded handleDecision={() => setModalForm(true)} icon="folder-outline" text="Crear un nuevo expediente"/>
          <RectangleRounded handleDecision={() => router.push('/(tabs)')} icon="ban-outline" text="No guardar los datos"/>

          <CustomModal modalVisible={modalVisible} setModalHidden={() => setModalVisible(false)}>
            <View className="mt-4">
              {!expedientes && (
                <Text className="text-lg text-center font-medium mb-4">No hay plantas para mostrar</Text>
              )}
              {expedientes && (
                <>
                  <Text className="text-2xl text-center font-semibold mb-4">Elije tu planta</Text>
                  <View className='flex gap-2'>
                    {expedientes.map((expediente) => (
                      <PlantaCard 
                        key={expediente.id_expediente}
                        nombre={expediente.planta.name}
                        nombreCientifico={expediente.planta.nombre_cientifico}
                        salud={expediente.ultimo_registro.healthy}
                        estres={expediente.ultimo_registro.stressed}
                        humedad={expediente.ultimo_registro.dry}
                        anomalias={expediente.ultimo_registro.anomaly}
                        handleAction={() => handleSubmitResults(expediente.id_expediente)}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
          </CustomModal>

          <CustomModal modalVisible={modalForm} setModalHidden={() => setModalForm(false)}>
            <View className="flex">
              {!expedientes && (
                <Text className="text-lg text-center font-medium mb-4">No posees plantas, por favor, agrega una para guardar un expediente</Text>
              )}
                {expedientes && (
                  <View className=''>
                    <Text className="text-2xl text-center font-semibold mb-4">Crear un nuevo expediente</Text>
                    <Text>Selecciona una opción:</Text>
                    <Picker
                      className="border border-black rounded-lg shadow-sm"
                      selectedValue={selectedPlant}
                      onValueChange={(itemValue) => setSelectedPlant(itemValue)}>
                        {plants?.map(plant => (
                          <Picker.Item key={plant.id_planta} label={plant.name} value={plant.id_planta} />
                        ))}
                    </Picker>
                    <TouchableOpacity 
                      className="bg-green-700 rounded-lg py-4 items-center"
                      onPress={handleSubmitNewExpediente}>
                      <Text className="text-white font-bold text-lg">
                        {'Crear expediente'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </CustomModal>
        </View>
      </View>
    </View>
  );
}