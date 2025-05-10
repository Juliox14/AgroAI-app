// Types
import { responseExpediente } from '@/interfaces/response.general';
import { expediente } from "@/types/general";

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import PlantaCard from './PlantaCard';

export default function NDVIPrueba() {
  const [modalVisible, setModalVisible] = useState(false);
  const [plants, setPlants] = useState<expediente[] | undefined>(undefined);
  const router = useRouter();
  const { payload } = useAuth();

  useEffect(() => {
    const fetchPlants = async () => {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/plants/${payload?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseJSON = await res.json() as responseExpediente;
      responseJSON.data?.map((expediente) => {
        setPlants(prev => ([...prev || [], expediente ]))
      })
      if (!res.ok) {
        Alert.alert('Error', responseJSON.message);
        return;
      }
    }

    fetchPlants();
  }, [])

  const handleDecision = (index: number) => {
      if(index === 0){
        // console.log(plants);  si quieres ver el objeto
        setModalVisible(true);
      }else if(index === 1){
        // console.log(payload); Es el id del usuario
      }else if(index === 2){
        return router.push('/(tabs)')
      }
  }

  return (
    <View className="flex-1 p-[22px] bg-white">
      <View className='flex gap-6'>
        <Text className='text-2xl text-center text-shadow-sky-300'>¿Qué deseas hacer con tus datos?</Text>
        <View className="gap-4">
          <TouchableOpacity onPress={() => {handleDecision(0)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
            <Ionicons name="bookmark-outline" size={24} color="black" />
            <Text className="font-semibold ml-2">Insertar datos en un expediente existente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {handleDecision(1)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
            <Ionicons name="folder-outline" size={24} color="black" />
            <Text className="font-semibold ml-2">Crear un nuevo expediente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {handleDecision(2)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
            <Ionicons name="ban-outline" size={24} color="black" />
            <Text className="font-semibold ml-2">No guardar los datos</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
              <View className="bg-white rounded-2xl w-[90%] h-[85%] shadow-lg relative overflow-y-auto">
                <ScrollView className='p-6'>
                  <TouchableOpacity 
                  className="absolute right-3 top-3 w-8 h-8 rounded-full items-center justify-center"
                  onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-outline" size={24} color="black" />
                  </TouchableOpacity>
                  
                  <View className="mt-4">
                    {!plants && (
                      <Text className="text-lg text-center font-medium mb-4">No hay plantas para mostrar</Text>
                    )}
                    <Text className="text-2xl text-center font-semibold mb-4">Elije tu planta</Text>
                    {plants && (
                      <View className='flex gap-6'>
                        {plants.map(((plant, index) => (
                          <PlantaCard
                            key={index} 
                            nombre={plant.planta.nombre}
                            nombreCientifico={plant.planta.nombre_cientifico}
                            salud={50}
                            estres={50}
                            humedad={50}
                            anomalias={50}
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