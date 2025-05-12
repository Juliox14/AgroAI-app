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
      <View className="flex-1 justify-center items-center bg-transparent bg-opacity-50">
        <View className="bg-white w-full h-screen relative">
          <TouchableOpacity 
            className="absolute right-10 top-10 w-8 h-8 rounded-full items-center justify-center z-10"
            onPress={() => setModalHidden()}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
          <ScrollView className="h-full px-10 mt-10">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}