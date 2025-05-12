// React
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Types
import { SettingsresultsProps } from "@/interfaces/components";

// Components
import PlantaCard from './PlantaCard';
import RectangleRounded from './RectagleRounded';

// Icons 
import { Ionicons } from '@expo/vector-icons';

// Functions
import { createFileFromBase64 } from '@/utils/general';

export default function SettingsResults({ expedientes, stats, imageBase64, payload }:SettingsresultsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDecision = (index: number) => {
      if(index === 0){
        setModalVisible(true);
      }else if(index === 1){

      }else if(index === 2){
        return router.push('/(tabs)')
      }
  }

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

      console.log("hola");
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/database/registrar`, {
        method: 'POST',
        body: formData
      });
      console.log("Response", response);
    }catch (error) {
      console.error("Error al llamar al microservicio:", error);
      Alert.alert('Error', "Error al comunicarse con el microservicio");
      return;
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className='flex gap-6'>
        <Text className='text-2xl text-center text-shadow-sky-300'>¿Qué haras con estos datos?</Text>
        <View className="gap-4">
          <RectangleRounded handleDecision={() => handleDecision(0)} icon="bookmark-outline" text="Insertar datos en un expediente existente"/>
          <RectangleRounded handleDecision={() => handleDecision(1)} icon="folder-outline" text="Crear un nuevo expediente"/>
          <RectangleRounded handleDecision={() => handleDecision(2)} icon="ban-outline" text="No guardar los datos"/>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
              <View className="bg-white w-full h-full relative overflow-y-auto">
                <TouchableOpacity 
                  className="absolute right-5 top-5 w-8 h-8 rounded-full items-center justify-center z-10"
                  onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-outline" size={24} color="black" />
                </TouchableOpacity>
                <ScrollView className="px-10 mt-10">
                  <View className="mt-4">
                    {!expedientes && (
                      <Text className="text-lg text-center font-medium mb-4">No hay plantas para mostrar</Text>
                    )}
                    <Text className="text-2xl text-center font-semibold mb-4">Elije tu planta</Text>
                      {expedientes && (
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
                      )}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}