import { payload } from "@/types/auth";
import { expediente, plant } from "@/types/general";

export interface PlantaCardProps {
  nombre: string;
  nombreCientifico: string;
  uriImagen?: string;
  salud: number;
  estres: number;
  humedad: number;
  anomalias: number;
  handleAction: () => void;
}

export interface NDVIResultComponentProps {
  stats: {
    healthy_percentage: number;
    stressed_percentage: number;
    dry_percentage: number;
    anomaly_percentage: number;
  };
  imageBase64: string;
}

export interface RectangleRoundedProps {
  handleDecision: () => void,
  icon: string,
  text: string
}

export interface SettingsresultsProps{
  payload: payload | null,
  plants: plant[] | undefined,
  expedientes: expediente[] | undefined,
  stats: {
    healthy_percentage: number,
    stressed_percentage: number,
    dry_percentage: number,
    anomaly_percentage: number,
  }
  imageBase64: string
}

export interface CustomModalProps {
  modalVisible: boolean,
  setModalHidden: () => void,
  children?: React.ReactNode
}