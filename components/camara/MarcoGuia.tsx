import { View } from 'react-native';

const MarcoGuia = () => {
    return (
        <View className="absolute top-24 left-5 right-5 w-[90%] h-3/5 justify-center items-center">
            {/* Esquinas recortadas */}
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/70 rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white/70 rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white/70 rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/70 rounded-br-lg" />

            {/* Sombra interna ligera */}
            <View className="absolute inset-0 border border-dashed border-white/30 rounded-xl" />
        </View>
    );
}

export default MarcoGuia;