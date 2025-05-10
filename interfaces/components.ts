import { expediente } from "@/types/general";

export interface PlantaCardProps {
    nombre: string;
    nombreCientifico: string;
    salud: number;
    estres: number;
    humedad: number;  
    anomalias: number; 
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
  handleDecision: (index: number) => void,
  index: number,
  icon: string,
  text: string,
}

export interface SettingsresultsProps{
  plants: expediente[] | undefined;
}