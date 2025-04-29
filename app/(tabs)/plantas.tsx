import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const plantasEjemplo = [
  { id: '1', nombre: 'Aloe Vera', imagen: require('../../assets/images/planta.png') },
  { id: '2', nombre: 'Helecho', imagen: require('../../assets/images/planta.png') },
  { id: '3', nombre: 'Cactus', imagen: require('../../assets/images/planta.png') },
  // Agrega más plantas si deseas
]

const Plantas = () => {
  const navigation = useNavigation()

  return (
    <FlatList
      data={plantasEjemplo}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Expediente', { planta: item })}
        >
          <Image source={item.imagen}/>
          <Text>{item.nombre}</Text>
        </TouchableOpacity>
      )}
    />
  )
}

export default Plantas