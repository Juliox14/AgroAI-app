export type expediente = {
  fecha_creacion: string,
  id_expediente: number,
  uri_imagen_principal: string,
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


export type expedienteVista = {
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