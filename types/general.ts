export type expediente = {
  fecha_creacion: string,
  id_expediente: number,
  uri_imagen_principal: string,
  planta: {
    id_planta: number,
    name: string,
    nombre_cientifico: string,
  },
  registros: registro[],
}

export type registro = {
  id_registro: number,
  fecha_registro: string,
  healthy: number,
  stressed: number,
  dry: number,
  anomaly: number,
  imagenes: {
    uri: string,
    key: string,
    name: string,
    fecha: string,
  }[],
}