export type expediente = {
  fecha_creacion: string,
  id_expediente: number,
  planta: {
    name: string,
    nombre_cientifico: string,
  },
  ultimo_registro: {
    anomaly: number,
    dry: number,
    fecha: string,
    healthy: number,
    id_registro: number,
    stressed: number,
  },
  uri_imagen: string,
}

export type plant = {
  id_imagen_planta: number,
  id_planta: number,
  name: string,
  nombre_cientifico: string,
  was_deleted: boolean,
}