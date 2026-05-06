import * as FileSystem from 'expo-file-system/legacy';
import NetInfo from '@react-native-community/netinfo';
import {
  obtenerPendientes,
  marcarSincronizado,
  incrementarIntentos,
} from './db';

let sincronizando = false;

// Mapeo de tipo → endpoint base
const ENDPOINT: Record<string, string> = {
  registro:         '/database/registrar',
  nuevo_expediente: '/database/postExpedientes',
  nueva_parcela:    '/api/parcelas',
  editar_parcela:   '/api/parcelas',
};

// Tipos que usan PATCH en lugar de POST
const USA_PATCH = new Set(['editar_parcela']);

export async function sincronizarCola(
  baseUrl: string,
  token: string
): Promise<{ exitosos: number; fallidos: number }> {

  if (sincronizando) return { exitosos: 0, fallidos: 0 };
  sincronizando = true;

  try {
  const estado = await NetInfo.fetch();
  if (!estado.isConnected) return { exitosos: 0, fallidos: 0 };

  const pendientes = obtenerPendientes();
  if (pendientes.length === 0) return { exitosos: 0, fallidos: 0 };

  let exitosos = 0;
  let fallidos = 0;

  for (const item of pendientes) {
    try {
      const payload = JSON.parse(item.payload) as Record<string, string>;

      // Para editar_parcela el id de la parcela va en la URL
      const sufijo = item.tipo === 'editar_parcela' && payload.id
        ? `/${payload.id}`
        : '';

      const url    = `${baseUrl}${ENDPOINT[item.tipo]}${sufijo}`;
      const method = USA_PATCH.has(item.tipo) ? 'PATCH' : 'POST';

      const formData = new FormData();

      // Adjuntar imagen si existe en caché y el tipo la necesita
      const tiposConImagen = new Set(['registro', 'nuevo_expediente', 'nueva_parcela', 'editar_parcela']);
      if (tiposConImagen.has(item.tipo) && item.image_uri) {
        const info = await FileSystem.getInfoAsync(item.image_uri);
        if (info.exists) {
          formData.append('imagen', {
            uri:  item.image_uri,
            name: 'imagen.jpg',
            type: 'image/jpeg',
          } as any);
        }
      }

      // Adjuntar todos los campos del payload
      // (para editar_parcela ignoramos el campo 'id' — ya va en la URL)
      for (const [key, value] of Object.entries(payload)) {
        if (item.tipo === 'editar_parcela' && key === 'id') continue;
        formData.append(key, value);
      }

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        marcarSincronizado(item.id);
        exitosos++;
      } else {
        incrementarIntentos(item.id);
        fallidos++;
        console.warn(`[AgroAI Sync] Falló item ${item.id} (${item.tipo}) — status ${res.status}`);
      }

    } catch (error) {
      incrementarIntentos(item.id);
      fallidos++;
      console.error(`[AgroAI Sync] Error en item ${item.id} (${item.tipo}):`, error);
    }
  }

  console.log(`[AgroAI Sync] ✓ ${exitosos} enviados · ✗ ${fallidos} fallidos`);
  return { exitosos, fallidos };
  } finally {
    sincronizando = false;
  }
}