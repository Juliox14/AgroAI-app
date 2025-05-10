// Types
import { plantCard } from '@/types/auth';

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { responsePlants } from '@/interfaces/response.general';

interface Props {
  stats: {
    healthy_percentage: number;
    stressed_percentage: number;
    dry_percentage: number;
    anomaly_percentage: number;
  };
}

export default function NDVIPrueba() {
  const [modalVisible, setModalVisible] = useState(false);
  const [plants, setPlants] = useState<plantCard[]>([]);
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

      const data = await res.json() as responsePlants;
      console.log(data);
      if (!res.ok) {
        Alert.alert('Error', data.message);
        return;
      }

      setPlants(data.data);
    }

    fetchPlants();
  }, [])

  const handleDecision = (index: number) => {
      if(index === 0){
        console.log(payload?.id);  
        setModalVisible(true);
      }else if(index === 1){
        console.log(payload);
      }else if(index === 2){
        return router.push('/(tabs)')
      }
  }

  useEffect(() => {
    console.log("Variable", plants);
  }, [plants]);

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
              <View className="bg-white rounded-2xl p-6 w-4/5 shadow-lg relative">
                <TouchableOpacity 
                  className="absolute right-3 top-3 w-8 h-8 rounded-full items-center justify-center"
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close-outline" size={24} color="black" />
                </TouchableOpacity>
                
                <View className="mt-4">
                  {!plants && (
                    <Text className="text-lg text-center font-medium mb-4">No hay plantas para mostrar</Text>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}