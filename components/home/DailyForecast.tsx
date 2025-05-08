// components/home/DailyForecast.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';


type emojiByDesc = {
  [key: string]: string;
};


const emojiByDesc: emojiByDesc = {
  'Despejado': '☀️',
  'Mayormente despejado': '🌤️',
  'Parcial nuboso': '⛅️',
  'Poco nuboso': '⛅️',
  'Cielo nublado': '☁️',
  'Medio nublado': '☁️',
  'Lluvia aislada':'🌧️',
  'Tormenta': '⛈️',
};

export type ForecastItem = {
  ndia: string;       // número de día (0 = hoy, 1 = mañana, …)
  dloc: string;       // YYYYMMDDhhmm
  tmax: string;       // temp. máxima (°C)
  tmin: string;       // temp. mínima (°C)
  desciel: string;    // descripción del cielo
  probprec: string;   // prob. precipitación (%)
  prec: string;       // precipitación (mm)
  velvien: string;    // velocidad del viento (km/h)
  dirvienc: string;   // dirección del viento (cardinal)
  cc: string;         // cobertura de nubes (%)
  nmun: string;       // nombre municipio
  nes: string;        // nombre estado
};

interface Props {
  data: ForecastItem[];
}

export default function DailyForecast({ data }: Props) {
  const items = Array.isArray(data) ? data : [];

  // Etiqueta legible para cada día
  const labelFor = (ndia: string) => {
    switch (ndia) {
      case '0': return 'Hoy';
      case '1': return 'Mañana';
      default: return `+${ndia}d`;
    }
  };

  const getDia = (f: ForecastItem) => {
    const ndia = parseInt(f.ndia, 10);
    if (ndia === 0) return 'Hoy';
    if (ndia === 1) return 'Mañana';
    // Parseamos YYYYMMDD de dloc (ignoramos la "Thh")
    const datePart = f.dloc.split('T')[0];       // "20250507"
    const year = parseInt(datePart.slice(0, 4), 10);
    const month = parseInt(datePart.slice(4, 6), 10) - 1;
    const day = parseInt(datePart.slice(6, 8), 10);
    const date = new Date(year, month, day);


    // Capitalizamos (primera letra) el nombre del día
    const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return capitalized;

  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
    >
      {items.slice(0, 4).map((forecast, i) => {
        const emoji = emojiByDesc[forecast.desciel] || '❔';
        const label = getDia(forecast);
        return (
          <View
            key={i}
            className="bg-gray-50 rounded-lg p-3 mr-3 items-center"
          >
            <Text className="text-sm font-medium text-gray-600 mb-1">
              {label}
            </Text>
            <Text className="text-2xl mb-1">{emoji}</Text>
            <Text className="text-base font-semibold">
              {forecast.tmax}° / {forecast.tmin}°
            </Text>
            <Text className="text-xs text-blue-600 mt-1">
              ☔ {forecast.probprec}% ({forecast.prec} mm)
            </Text>
            <Text className="text-xs text-gray-600">
              🌬️ {forecast.velvien} km/h
            </Text>
            {/* <Text className="text-xs text-gray-600">
              ☁️ {f.cc}%
            </Text> */}
          </View>
        );
      })}
    </ScrollView>
  );
}
