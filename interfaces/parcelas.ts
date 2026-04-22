export interface Parcela {
  id: string;
  nombre: string;
  comunidad_ejido?: string;
  area_metros_cuadrados?: number;
  tipo_sistema: string;
  cultivos_asociados: string;
  tipo_riego: string;
  fecha_siembra?: string;
  imagen_url?: string; // Nueva propiedad para la URL de la imagen
}