import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import Result from './Result';
import ZoomableImage from './ZoomableImage';
import { useAuth } from '@/context/AuthContext';

interface Props {
  stats: {
    healthy_percentage: number;
    stressed_percentage: number;
    dry_percentage: number;
    anomaly_percentage: number;
  };
  imageBase64: string;
}

export default function NDVIResultComponent({ stats, imageBase64 }: Props) {
  const uri = `data:image/jpeg;base64,${imageBase64}`;

  const { payload } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [plants, setPlants] = useState([]);
  const router = useRouter();

  const handleDecision = (index: number) => {
    if(index === 0){

      async() => {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/plants/${payload?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await res.json();
        if (!res.ok) {
          Alert.alert('Error', data.body.message);
          return;
        }

        setPlants(data);
      }
      setModalVisible(true);
    }else if(index === 1){

    }else if(index === 2){
      return router.push('/(tabs)')
    }
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Resultados del análisis NDVI</Text>

      <ZoomableImage
        source={{ uri }}
        thumbnailStyle={styles.previewImage}
      /* opcional puedes pasar modalImageStyle si quieres bordes o márgenes */
      />

      <View className='flex-1 gap-6'>
        <Result
          nameIcon="leaf"
          value={stats.healthy_percentage}
          label="Porcentaje de vegetación sana"
        />


        <Result
          nameIcon="water"
          value={stats.stressed_percentage}
          label="Porcentaje de estrés hídrico"
        />

        <Result
          nameIcon="skull"
          value={stats.dry_percentage}
          label="Porcentaje de vegetación seca"
        />


        <Result
          nameIcon="alert-circle"
          value={stats.anomaly_percentage}
          label="Porcentaje de anomalías"
        />
      </View>
      
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
            onRequestClose={() => setModalVisible(false)} // para Android back
          >
            <View style={styles.overlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>¡Hola! Soy un modal</Text>
                <Pressable style={styles.buttonClose} onPress={() => setModalVisible(false)}>
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,              // make the scroll view fill its parent
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
    gap: 20,
    // you can use flexGrow if you want centering when there's little content:
    // flexGrow: 1,
    // justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1f2937',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
  },

  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // fondo semitransparente
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonClose: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },
});