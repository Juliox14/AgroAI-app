import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RectangleRoundedProps } from '@/interfaces/general.interfaces';

export default function RectangleRounded({handleDecision, index, icon, text}: RectangleRoundedProps) {
  return (
    <TouchableOpacity onPress={() => {handleDecision(index)}} className="bg-gray-50 h-14 px-4 rounded-xl flex flex-row items-center">
      <Ionicons name={icon as any} size={24} color="black" />
      <Text className="font-semibold ml-2">{text}</Text>
    </TouchableOpacity>
  )
}