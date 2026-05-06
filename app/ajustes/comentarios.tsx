import React, { useState } from 'react';
import {
  View, Text, ScrollView, useColorScheme, StatusBar, TextInput, TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import { Stack } from 'expo-router';

export default function ComentariosScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const theme = {
    bg: dark ? '#111827' : '#F3F4F6',
    border: dark ? '#374151' : '#E5E7EB',
    title: dark ? '#F3F4F6' : '#111827',
    body: dark ? '#D1D5DB' : '#4B5563',
    primaryGreen: '#15803d',     
    inputBg: dark ? '#1F2937' : '#FFFFFF',
  };

  const handleEnviar = async () => {
    if (!comentario.trim()) {
      Alert.alert('System Message', 'Field cannot be empty. Please provide input.');
      return;
    }

    setEnviando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setComentario('');
      Alert.alert('Success', 'Feedback submitted to AgroAI Core Service.');
    } catch (error) {
      Alert.alert('Error', 'Communication failure with the feedback microservice.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Retroalimentación',
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: theme.primaryGreen },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
          headerShadowVisible: false,
        }}
      />

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={theme.primaryGreen} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header de Sección Técnico */}
          <View style={styles.headerBlock}>
            <Text style={[styles.mainTitle, { color: theme.title }]}>
              Feedback del Sistema
            </Text>
            <Text style={[styles.introText, { color: theme.body }]}>
              ¿Tienes alguna sugerencia o has encontrado algún problema con la aplicación? En este apartado puedes reportar inconsistencias técnicas, sugerir optimizaciones o proponer mejoras para AgroAI.
            </Text>
          </View>

          {/* Área de Entrada de Datos */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputLabelWrapper, { borderBottomColor: theme.border }]}>
              <Text style={[styles.inputLabel, { color: theme.primaryGreen }]}>TU COMENTARIO</Text>
              <Text style={[styles.statusTag, { color: theme.body }]}>{comentario.length} CHR</Text>
            </View>

            <TextInput
              value={comentario}
              onChangeText={setComentario}
              placeholder="Ejemplo: Me gustaría ver gráficas de humedad..."
              placeholderTextColor={dark ? '#484F58' : '#9CA3AF'}
              multiline
              numberOfLines={8}
              style={[
                styles.textInput,
                { 
                  backgroundColor: theme.inputBg, 
                  color: theme.title,
                  borderColor: theme.border 
                }
              ]}
            />
          </View>

          {/* Botón de Envío Industrial */}
          <TouchableOpacity
            onPress={handleEnviar}
            disabled={enviando}
            activeOpacity={0.7}
            style={[
              styles.actionButton,
              { backgroundColor: theme.primaryGreen }
            ]}
          >
            <Text style={styles.actionButtonText}>
              {enviando ? 'EXECUTING...' : 'ENVIAR REPORTE'}
            </Text>
          </TouchableOpacity>

          {/* Nota de pie de página */}
          <View style={styles.noticeBox}>
            <View style={[styles.noticeLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.noticeText, { color: theme.body }]}>
              Toda la información enviada es procesada por el Forensic-Service para su análisis y posterior mejora del ecosistema.
            </Text>
          </View>

          {/* Footer Obligatorio e Intocable */}
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
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 110,
  },
  headerBlock: {
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 12,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'justify',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabelWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  statusTag: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  textInput: {
    borderRadius: 8,
    padding: 16,
    minHeight: 180,
    textAlignVertical: 'top',
    fontSize: 14,
    borderWidth: 1,
    fontFamily: 'monospace', // Sensación de código/terminal
  },
  actionButton: {
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    // Estética industrial, sin sombras redondeadas pesadas
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 2,
  },
  noticeBox: {
    marginTop: 35,
    alignItems: 'center',
  },
  noticeLine: {
    height: 1,
    width: 40,
    marginBottom: 15,
  },
  noticeText: {
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
});