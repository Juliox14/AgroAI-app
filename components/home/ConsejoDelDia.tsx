import { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import NetInfo from '@react-native-community/netinfo';


interface Props {
    clima: {
        temperature: number;
        wind_speed: number;
        precipitation: number;
        temp_max: number;
        temp_min: number;
    } | null;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;

export default function ConsejoDelDia({ clima }: Props) {
    const { token } = useAuth();
    const [consejo, setConsejo] = useState('');
    const [loading, setLoading] = useState(true);

    const yaGeneró = useRef(false);

    useEffect(() => {
        if (!token || !clima || yaGeneró.current) return;
        yaGeneró.current = true;
        generarConsejo();
    }, [token, clima]);

    const generarConsejo = async () => {
        setLoading(true);
        try {

            const net = await NetInfo.fetch();
            if (!net.isConnected) {
                setConsejo('Sin conexión a internet. Conectate para recibir tu consejo del día.');
                return;
            }
            // 1. Traer parcelas
            const parcelasRes = await fetch(`http://${IP}:3000/api/parcelas`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const parcelasJson = await parcelasRes.json();
            const parcelas = parcelasJson.success ? parcelasJson.data : [];

            // 2. Traer estadísticas de cada parcela
            const stats = await Promise.all(
                parcelas.map(async (p: any) => {
                    try {
                        const r = await fetch(`http://${IP}:3000/api/parcelas/${p.id}/estadisticas`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await r.json();
                        return {
                            nombre: p.nombre,
                            cultivos: p.cultivos_asociados,
                            tipo_sistema: p.tipo_sistema,
                            ultimo_ndvi: data.success ? data.data.ultimo_ndvi : null,
                            total_analisis: data.success ? data.data.total_analisis : 0,
                        };
                    } catch {
                        return { nombre: p.nombre, cultivos: p.cultivos_asociados, ultimo_ndvi: null, total_analisis: 0 };
                    }
                })
            );

            // 3. Construir el prompt
            const fecha = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

            const parcelasTexto = stats.length === 0
                ? 'El productor aún no tiene parcelas registradas.'
                : stats.map(p => {
                    const ndviTexto = p.total_analisis === 0
                        ? 'sin análisis NDVI todavía'
                        : `NDVI ${p.ultimo_ndvi} (${p.total_analisis} análisis realizados)`;
                    return `- ${p.nombre} (${p.cultivos}, sistema ${p.tipo_sistema}): ${ndviTexto}`;
                }).join('\n');

            const prompt = `Eres un agrónomo experto en agricultura tradicional mexicana, especialmente en sistemas milpa y cultivos de Chiapas.

Hoy es ${fecha}. El clima actual es:
- Temperatura actual: ${clima?.temperature}°C
- Temperatura máxima: ${clima?.temp_max}°C
- Temperatura mínima: ${clima?.temp_min}°C
- Viento: ${clima?.wind_speed} km/h
- Precipitación: ${clima?.precipitation} mm

Las parcelas del productor son:
${parcelasTexto}

Da UN consejo agrícola concreto y directo para hoy, máximo 2 oraciones. 
No expliques tu razonamiento. No uses condicionales. No menciones el NDVI explícitamente.
Habla directamente al productor como si fuera tu recomendación personal.
Ejemplo de formato correcto: "Riega temprano en la mañana antes de que suba el calor. Aprovecha que no hay viento para aplicar abono foliar."`;

            // 4. Llamar a Gemini
            const res = await fetch(GROQ_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = await res.json();            
            const texto = data.choices?.[0]?.message?.content ?? '';
            setConsejo(texto.trim());

        } catch (e) {
            console.error('Error generando consejo:', e);
            setConsejo('No se pudo cargar el consejo de hoy. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="bg-green-700 rounded-2xl p-5 mb-4 shadow">
            <View className="flex-row items-center mb-3 gap-2">
                <View className="bg-green-600 p-1.5 rounded-full">
                    <Ionicons name="bulb-outline" size={18} color="white" />
                </View>
                <Text className="text-white font-bold text-base">Consejo del día</Text>
                <View className="ml-auto bg-green-600 px-2 py-0.5 rounded-full">
                    <Text className="text-green-200 text-xs">IA</Text>
                </View>
            </View>

            {loading ? (
                <View className="flex-row items-center gap-3 py-2">
                    <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
                    <Text className="text-green-200 text-sm">Analizando tus parcelas...</Text>
                </View>
            ) : (
                <Text className="text-white text-sm leading-6">{consejo}</Text>
            )}
        </View>
    );
}