import React from 'react';
import { View, Text, ScrollView, useColorScheme, StatusBar, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PoliticaScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const theme = {
    bg: dark ? '#111827' : '#F3F4F6',
    card: dark ? '#1F2937' : '#FFFFFF',
    border: dark ? '#374151' : '#E5E7EB',
    title: dark ? '#F3F4F6' : '#111827',
    body: dark ? '#D1D5DB' : '#4B5563',
    primaryGreen: '#15803d',
    navBlue: '#161D26',      
    danger: '#FCA5A5',      
    bannerBg: dark ? '#1A2E1F' : '#E8F5E9',
    bannerText: dark ? '#A7F3C0' : '#1A823B',
  };

  const sections = [
    {
      title: 'Transparencia de Datos',
      content: 'En AgroAI, recolectamos datos técnicos esenciales para el monitoreo agrícola. Esto incluye coordenadas GPS de tus parcelas para el Weather-service y metadatos de imágenes capturadas por el hardware de Edge Computing (Raspberry Pi 5).',
    },
    {
      title: 'Uso de la Información',
      content: 'La información capturada se procesa a través de nuestros microservicios especializados. El NDVI-service analiza el estrés hídrico, mientras que el Forensic-service almacena registros históricos en clústeres de MongoDB.',
    },
    {
      title: 'Protección y Seguridad',
      content: 'Toda comunicación entre la app y el backend se realiza mediante protocolos seguros y autenticación JWT. Los datos sensibles se gestionan en redes privadas de contenedores Docker.',
    },
    {
      title: 'Almacenamiento Híbrido',
      content: 'Siguiendo nuestra filosofía Offline-First, los datos se guardan inicialmente en SQLite local y se sincronizan con PostgreSQL y Cloudinary solo al detectar conexión estable.',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Política de privacidad',
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: theme.primaryGreen },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
        }}
      />

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={theme.primaryGreen} />

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Introducción (Mantenida como te gustó) */}
          <View style={styles.headerBlock}>
            <Text style={[styles.introText, { color: theme.body }]}>
              Esta política rige el tratamiento de datos dentro del ecosistema de{' '}
              <Text style={{ fontWeight: 'bold', color: theme.primaryGreen }}>AgroAI</Text>. 
              Buscamos proteger la soberanía tecnológica de los productores mediante un manejo transparente de la información recolectada en campo.
            </Text>
          </View>

          {/* Secciones con Estilo de Pestaña Técnica */}
          {sections.map((section, index) => (
            <View key={index} style={styles.moduleWrapper}>
              <View style={[styles.tabHeader, { backgroundColor: dark ? '#1A232E' : '#F1F5F9' }]}>
                <View style={[styles.sideIndicator, { backgroundColor: theme.primaryGreen }]} />
                <Text style={[styles.sectionTitle, { color: theme.title }]}>
                  {section.title}
                </Text>
              </View>
              <View style={styles.contentArea}>
                <Text style={[styles.sectionContent, { color: theme.body }]}>
                  {section.content}
                </Text>
              </View>
            </View>
          ))}

          {/* Footer Obligatorio */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Versión 1.2 • Actualizado Mayo 2026
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 110,
  },
  headerBlock: {
    marginBottom: 40,
    paddingHorizontal: 6,
  },
  introText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'justify',
  },
  moduleWrapper: {
    marginBottom: 32,
    overflow: 'hidden',
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sideIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  contentArea: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingLeft: 28, // Alineado después del indicador lateral
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  footerContainer: {
    marginTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
});