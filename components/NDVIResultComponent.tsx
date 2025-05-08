import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Result from './Result'; // Assuming you have a Result component
import ZoomableImage from './ZoomableImage'; // Assuming you have a ZoomableImage component

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
});