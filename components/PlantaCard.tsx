import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text, Touchable, TouchableOpacity } from "react-native";
import { PlantaCardProps } from "@/interfaces/components";
import { Link } from "expo-router";

const PlantaCard = ({ nombre, nombreCientifico, salud = 40, estres = 10, humedad = 25, anomalias = 90, uriImagen, handleAction }: PlantaCardProps) => {
    return (
        <TouchableOpacity onPress={handleAction} className="mb-4 px-6 py-4 rounded-xl bg-white shadow-md h-auto w-full justify-center items-center">
            <View className="flex-row w-full px-4 py-2 pb-4 border-b border-b-gray-400">
                <Image source={uriImagen ? { uri: uriImagen } : require("@/assets/images/aloe.png")} className="w-20 h-20 mr-4 rounded-full border border-gray-400" />
                <View className="flex-1 justify-center">
                    <Text className="text-lg font-semibold mb-1 mt-4 text-gray-800">
                        {nombre}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-4 ">
                        {nombreCientifico}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center flex-wrap gap-y-2 w-full mt-4 justify-between mb-2 px-2">
                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="leaf-sharp" size={24} />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${salud}%` }}
                            className="h-1 bg-green-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {salud}%
                    </Text>
                </View>

                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="water-sharp" size={24} />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${estres}%` }}
                            className="h-1 bg-green-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {estres}%
                    </Text>
                </View>

                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="earth-sharp" size={24} />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${humedad}%` }}
                            className="h-1 bg-green-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {humedad}%
                    </Text>
                </View>

                <View className="flex-row items-center justify-center gap-2 mt-2">
                    <Ionicons name="sunny-sharp" size={24} />
                    <View className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            style={{ width: `${anomalias}%` }}
                            className="h-1 bg-green-700"
                        />
                    </View>
                    <Text className="text-sm text-gray-600">
                        {anomalias}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default PlantaCard;