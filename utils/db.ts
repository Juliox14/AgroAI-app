import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('agroai_queue.db');

export interface ItemCola {
  id: number;
  tipo: 'registro' | 'nuevo_expediente' | 'nueva_parcela' | 'editar_parcela';
  payload: string;       // JSON serializado del FormData fields
  image_uri: string;     // URI local de la imagen en caché
  sincronizado: number;  // 0 = pendiente, 1 = sincronizado
  creado_en: string;
  intentos: number;
}

export function inicializarDB(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS cola_ndvi (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo         TEXT    NOT NULL,
      payload      TEXT    NOT NULL,
      image_uri    TEXT    NOT NULL,
      sincronizado INTEGER NOT NULL DEFAULT 0,
      creado_en    TEXT    NOT NULL DEFAULT (datetime('now')),
      intentos     INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export function encolarItem(
  tipo: ItemCola['tipo'],
  payload: Record<string, string>,
  imageUri: string
): number {
  const result = db.runSync(
    `INSERT INTO cola_ndvi (tipo, payload, image_uri)
     VALUES (?, ?, ?)`,
    tipo,
    JSON.stringify(payload),
    imageUri
  );
  return result.lastInsertRowId;
}

export function obtenerPendientes(): ItemCola[] {
  return db.getAllSync<ItemCola>(
    `SELECT * FROM cola_ndvi
     WHERE sincronizado = 0 AND intentos < 5
     ORDER BY creado_en ASC`
  );
}

export function marcarSincronizado(id: number): void {
  db.runSync(
    `UPDATE cola_ndvi SET sincronizado = 1 WHERE id = ?`,
    id
  );
}

export function incrementarIntentos(id: number): void {
  db.runSync(
    `UPDATE cola_ndvi SET intentos = intentos + 1 WHERE id = ?`,
    id
  );
}

export function contarPendientes(): number {
  const row = db.getFirstSync<{ total: number }>(
    `SELECT COUNT(*) as total FROM cola_ndvi WHERE sincronizado = 0`
  );
  return row?.total ?? 0;
}