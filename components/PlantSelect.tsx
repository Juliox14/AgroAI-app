import { Menu, TextInput, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { PlantSelectProps } from '@/interfaces/components';

import { View, Text } from 'react-native';

const PlantSelect = ({ plants, selectedPlant, onSelect }: PlantSelectProps) => {
  const [visible, setVisible] = useState(false);
  
  const selectedPlantName = plants?.find(p => p.id_planta.toString() === selectedPlant)?.name || "Seleccionar planta";

  return (
    <View style={{ marginVertical: 10 }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setVisible(true)}>
            <View style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Text>{selectedPlantName}</Text>
              <Ionicons name="chevron-down" size={20} color="gray" />
            </View>
          </TouchableRipple>
        }
      >
        {plants?.map(plant => (
          <Menu.Item
            key={plant.id_planta}
            onPress={() => {
              onSelect(plant.id_planta.toString());
              setVisible(false);
            }}
            title={plant.name}
          />
        ))}
      </Menu>
    </View>
  );
};

export default PlantSelect;