import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Result from './Result'; // Assuming you have a Result component

interface Props {
  stats: {
    healthy_percentage: number;
    stressed_percentage: number;
    dry_percentage: number;
    anomaly_percentage: number;
  };
}

export default function NDVIResultComponent({ stats }: Props) {
  return (
    <View className='flex-1 bg-white p-6 gap-6 h-full'>
      <Text style={styles.title}>Resultados del análisis NDVI</Text>

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
});
