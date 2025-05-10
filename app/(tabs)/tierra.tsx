import PlantaCard from '@/components/PlantaCard';
import Result from '@/components/Result';
import React from 'react'
import { Text, View } from 'react-native'

const Tierra = () => {

    return (
        <View className='w-full h-full bg-white items-center justify-center'>
            <PlantaCard nombre='Aloe Vera' nombreCientifico='Aloe barbadensis miller' salud={80} estres={60} humedad={70} anomalias={50} />
        </View>
    )
}


export default Tierra;
