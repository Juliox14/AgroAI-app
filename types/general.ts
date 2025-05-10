export type expediente = {
  fecha_creacion: string,
  id_expediente: number,
  planta: {
    id_planta: number,
    nombre: string,
    nombre_cientifico: string,
    uri_imagen: string
  },
  registros: {
    anomaly_percentage: number,
    dry_percentage: number,
    fecha_registro: string,
    healthy_percentage: number,
    id_registro: number,
    imagenes: [],
    stressed_percentage: number,
  }[]
}