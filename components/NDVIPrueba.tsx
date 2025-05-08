import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const [plants, setPlants] = useState([]);

  const router = useRouter()

  const stats = {
    healthy_percentage: 75.5,
    stressed_percentage: 15.2,
    dry_percentage: 5.3,
    anomaly_percentage: 4.0,
  }

  const handleDesicion = (index: number) => {
    if(index === 0){

      async() => {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/plant`, {
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
    <View style={styles.container}>
      <Text style={styles.title}>Resultados del análisis NDVI</Text>

      <View style={styles.statBox}>
        <Text style={styles.label}>🌿 Área saludable:</Text>
        <Text style={styles.value}>{stats.healthy_percentage.toFixed(2)}%</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>🌞 Estrés hídrico:</Text>
        <Text style={styles.value}>{stats.stressed_percentage.toFixed(2)}%</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>🔥 Zona seca:</Text>
        <Text style={styles.value}>{stats.dry_percentage.toFixed(2)}%</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>⚠️ Anomalías detectadas:</Text>
        <Text style={styles.value}>{stats.anomaly_percentage.toFixed(2)}%</Text>
      </View>

      <View className='flex gap-6'>
        <Text className='text-2xl text-center text-shadow-sky-300'>¿Qué deseas hacer con tus datos?</Text>
        <View className="gap-4">
          <TouchableOpacity onPress={() => {handleDesicion(0)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
            <Ionicons name="bookmark-outline" size={24} color="black" />
            <Text className="font-semibold ml-2">Insertar datos en un expediente existente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {handleDesicion(1)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
            <Ionicons name="folder-outline" size={24} color="black" />
            <Text className="font-semibold ml-2">Crear un nuevo expediente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {handleDesicion(2)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  statBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
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