import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    onPress?: () => void;
    ioniconName: any;
    iconSize: number;
    iconColor: string;
};

const Boton = ({ onPress, ioniconName, iconSize, iconColor }: Props) => {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-black/50 p-2 rounded-full"
        >
            <Ionicons name={ioniconName} size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
}

export default Boton;