export type Imagen = {
    id_imagen: number;
    uri_imagen: string;
    nombre_imagen: string;
};

export type Registro = {
    id_registro: number;
    fecha_registro: string;
    healthy: number;
    stressed: number;
    dry: number;
    anomaly: number;
    imagen: Imagen[];
};

export type Planta = {
    id_planta: number;
    name: string;
    nombre_cientifico: string;
    uri_imagen: string;
};

export type Expediente = {
    id_expediente: number;
    fecha_creacion: string;
    planta: Planta;
    ultimo_registro: Registro | null;
};