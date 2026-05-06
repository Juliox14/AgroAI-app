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

  return (
    <>
      <Stack.Screen
              options={{
                title: 'Términos y condiciones',
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
          
          {/* CUADRO VERDE: Banner de Seguridad */}
          <View style={[styles.infoBanner, { backgroundColor: theme.bannerBg }]}>
            <Text style={{ fontSize: 20 }}>🛡️</Text>
            <Text style={[styles.infoText, { color: theme.bannerText }]}>
              Tu privacidad y seguridad son nuestra prioridad. Revisa cómo protegemos tus datos agrícolas.
            </Text>
          </View>

          {/* SECCIÓN PRINCIPAL: Refinada para AgroAI */}
          <View style={styles.headerSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={[styles.mainTitle, { color: theme.title }]}>
                Aceptación de términos
              </Text>
            </View>
            
            <Text style={[styles.mainSub, { color: theme.body }]}>
              Al utilizar <Text style={{ fontWeight: 'bold', color: theme.primaryGreen }}>AgroAI</Text>, formalizas tu acuerdo con los lineamientos operativos de nuestra plataforma. Este documento regula el monitoreo de tus cultivos, el análisis de datos mediante sensores y el procesamiento de información geoespacial para la optimización de tu producción.
            </Text>
          </View>

          {/* GRUPO 1: Operatividad */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.tag, { backgroundColor: '#F1FAF3' }]}>
              <Text style={[styles.tagText, { color: theme.primaryGreen }]}>OPERACIÓN</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: theme.title }]}>🌱 Alcance del Servicio</Text>
            <Text style={[styles.sectionBody, { color: theme.body }]}>
              Los mapas NDVI y alertas climáticas son de carácter informativo. No sustituyen la asesoría agronómica presencial.
            </Text>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <Text style={[styles.sectionTitle, { color: theme.title }]}>⚙️ Disponibilidad</Text>
            <Text style={[styles.sectionBody, { color: theme.body }]}>
              Nuestro sistema es <Text style={{fontWeight: 'bold'}}>Offline-First</Text>. La sincronización ocurre automáticamente al recuperar conexión.
            </Text>
          </View>

          {/* SECCIÓN DE CONTRASTE: Restricciones */}
          <View style={[styles.restrictionBox, { backgroundColor: theme.card, borderColor: theme.danger }]}>
            <Text style={[styles.restrictionTitle, { color: '#B91C1C' }]}>🚫 Restricciones Críticas</Text>
            <Text style={[styles.sectionBody, { color: theme.body }]}>
              Queda prohibido cualquier intento de ingeniería inversa sobre los microservicios de AgroAI o el uso de la plataforma para fines ajenos al sector agrícola.
            </Text>
          </View>

          {/* GRUPO 2: Seguridad y Cuenta */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.tag, { backgroundColor: '#EBF2FF' }]}>
              <Text style={[styles.tagText, { color: '#2D63ED' }]}>SEGURIDAD</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: theme.title }]}>🔐 Protección de Datos</Text>
            <Text style={[styles.sectionBody, { color: theme.body }]}>
              Tu acceso está cifrado vía JWT. La confidencialidad de tu cuenta es responsabilidad exclusiva del usuario productor.
            </Text>
          </View>

          {/* ESPACIADO FINAL: Para evitar que los botones tapen la versión */}
          <View style={styles.footerContainer}>
            <Text style={styles.footer}>Versión 1.2 • Actualizado Mayo 2026</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 18,
    paddingTop: 20,
    paddingBottom: 100, // Aumentado para que no lo tapen los botones
  },
  infoBanner: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 12,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
headerSection: {
    marginBottom: 25,
    paddingHorizontal: 4,
  },
  mainTitle: {
    fontSize: 26, // Un poco más grande para mejor jerarquía
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  mainSub: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    // Solución para sombras con picos en Android/iOS
    backgroundColor: 'white', // Asegura un fondo sólido para la sombra
    overflow: 'hidden', 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  restrictionBox: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderLeftWidth: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  restrictionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 18,
  },
  footerContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
  activeDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  marginTop: 4,
  }
});