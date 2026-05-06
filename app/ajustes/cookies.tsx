import React from 'react';
import { View, Text, ScrollView, useColorScheme, StatusBar, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const SECTIONS = [
  {
    title: 'Naturaleza de las Cookies',
    code: '01',
    body: 'Las cookies son pequeños fragmentos de datos sincronizados con el almacenamiento local. En AgroAI, optimizan la comunicación con los microservicios y mantienen la persistencia de tus configuraciones agrícolas.',
  },
  {
    title: 'Uso en el Sistema',
    code: '02',
    bullets: [
      'Validación de sesiones seguras mediante JWT.',
      'Persistencia de preferencias en mapas NDVI.',
      'Gestión de colas en arquitectura Offline-First.',
      'Telemetría técnica del rendimiento de la plataforma.'
    ],
  },
  {
    title: 'Seguridad y Privacidad',
    code: '03',
    body: 'Los fragmentos de datos no contienen información sensible sin cifrar. Todo el flujo operativo sigue los protocolos de seguridad definidos en nuestro backend y clústeres de bases de datos.',
  },
  {
    title: 'Control del Usuario',
    code: '04',
    body: 'Puedes gestionar el almacenamiento local desde la configuración del sistema. Restringir estos datos podría afectar la capacidad de sincronización automática entre el hardware y la nube.',
  },
];

export default function CookiesScreen() {
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
          title: 'Política de cookies',
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
          {/* Título de página con contraste de galleta */}
          <View style={styles.headerBlock}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <View style={[styles.cookieBadge, { backgroundColor: dark ? '#1A2E1F' : '#E8F5E9' }]}>
                <Text style={{ fontSize: 18 }}>🍪</Text>
              </View>
              <Text style={[styles.mainTitle, { color: theme.title }]}>
                Gestión de datos locales
              </Text>
            </View>
            <Text style={[styles.sectionContent, { color: theme.body, paddingLeft: 4 }]}>
              Esta política rige el uso de tecnologías de almacenamiento local en <Text style={{ color: theme.primaryGreen, fontWeight: 'bold' }}>AgroAI</Text> para garantizar la fluidez operativa del sistema.
            </Text>
            <View style={[styles.horizontalLine, { backgroundColor: theme.primaryGreen }]} />
          </View>

          {/* Secciones Estilo Plano Técnico */}
          {SECTIONS.map((section, index) => (
            <View key={index} style={styles.sectionWrapper}>
              <View style={styles.titleRow}>
                <Text style={[styles.sectionNumber, { color: theme.primaryGreen }]}>{section.code}</Text>
                <Text style={[styles.sectionTitle, { color: theme.title }]}>{section.title}</Text>
              </View>

              <View style={[styles.contentIndentation, { borderColor: theme.border }]}>
                {section.body && (
                  <Text style={[styles.sectionContent, { color: theme.body }]}>
                    {section.body}
                  </Text>
                )}

                {section.bullets && section.bullets.map((bullet, bIndex) => (
                  <View key={bIndex} style={styles.bulletRow}>
                    <Text style={[styles.bulletSymbol, { color: theme.primaryGreen }]}>_</Text>
                    <Text style={[styles.bulletText, { color: theme.body }]}>{bullet}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

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
    paddingHorizontal: 30,
    paddingTop: 35,
    paddingBottom: 110,
  },
  headerBlock: {
    marginBottom: 50,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cookieBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    height: 3,
    width: 40,
    marginTop: 20,
    marginLeft: 4,
  },
  sectionWrapper: {
    marginBottom: 45,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  sectionNumber: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  contentIndentation: {
    paddingLeft: 20,
    borderLeftWidth: 1,
    marginLeft: 5,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  bulletSymbol: {
    marginRight: 8,
    fontWeight: '900',
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
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