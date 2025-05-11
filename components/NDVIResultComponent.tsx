// types
import { expediente } from "@/types/general";
import { responseExpediente } from '@/interfaces/response.general';

// Global variables
import { useAuth } from '@/context/AuthContext';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Result from './Result';
import ZoomableImage from './ZoomableImage';
import SettingsResults from './SettingsResults';
import { NDVIResultComponentProps } from "@/interfaces/components";

export default function NDVIResultComponent({ stats, imageBase64 }: NDVIResultComponentProps) {
  const uri = `data:image/jpeg;base64,${imageBase64}`;
  const [plants, setPlants] = useState<expediente[] | undefined>(undefined);
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
        setPlants(responseJSON.data);
        if (!res.ok) {
          Alert.alert('Error', responseJSON.message);
          return;
        }
      }
      fetchPlants();
    }, [])

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Resultados del análisis NDVI</Text>
      <ZoomableImage
        source={{ uri }}
        thumbnailStyle={styles.previewImage}
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

      <SettingsResults plants={plants} stats={stats} imageBase64={imageBase64} payload={payload}/>
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