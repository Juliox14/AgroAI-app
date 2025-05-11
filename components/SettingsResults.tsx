import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PlantaCard from './PlantaCard';
import RectangleRounded from './RectagleRounded';
import { SettingsresultsProps } from "@/interfaces/components";

export default function SettingsResults({ plants, stats, imageBase64, payload }:SettingsresultsProps) {
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
    const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/expediente/${id_expediente}/ndvi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  })
    });

    const responseJSON = await res.json();
    if (!res.ok) {
      Alert.alert('Error', responseJSON.message);
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
                    {!plants && (
                      <Text className="text-lg text-center font-medium mb-4">No hay plantas para mostrar</Text>
                    )}
                    <Text className="text-2xl text-center font-semibold mb-4">Elije tu planta</Text>
                      {plants && (
                        <View className='flex gap-2'>
                          {plants.map(((plant) => (
                            <PlantaCard 
                              key={plant.id_expediente}
                              nombre={plant.planta.nombre}
                              nombreCientifico={plant.planta.nombre_cientifico}
                              salud={50}
                              estres={50}
                              humedad={50}
                              anomalias={50}
                              handleAction={() => handleSubmitResults(plant.id_expediente)}
                            />
                          )))}
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