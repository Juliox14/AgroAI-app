// React
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';

// Types
import { CustomModalProps } from '@/interfaces/components';

// Icons 
import { Ionicons } from '@expo/vector-icons';

export default function CustomModal({children, modalVisible, setModalHidden}: CustomModalProps)  {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalHidden()}>
      <View className="bg-transparent bg-opacity-50">
        <View className="bg-white w-full relative">
          <TouchableOpacity 
            className="absolute right-10 top-8 w-8 h-8 rounded-full items-center justify-center z-10"
            onPress={() => setModalHidden()}>
            <Ionicons name="close-outline" size={34} color="black" />
          </TouchableOpacity>
          <View>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  )
}