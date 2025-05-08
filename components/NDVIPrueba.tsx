import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  stats: {
    healthy_percentage: number;
    stressed_percentage: number;
    dry_percentage: number;
    anomaly_percentage: number;
  };
}

export default function NDVIPrueba() {

  const stats = {
    healthy_percentage: 75.5,
    stressed_percentage: 15.2,
    dry_percentage: 5.3,
    anomaly_percentage: 4.0,
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

      <View className=''>
        <h2>¿Qué deseas hacer con tus datos?</h2>
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
});
