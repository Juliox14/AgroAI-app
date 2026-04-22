import SensorView from '@/components/tierra/SensorView';
import React from 'react'
import { Text, View } from 'react-native'

const Tierra = () => {

    return (
        <View className='flex-1 bg-gray-50 dark:bg-gray-900'>
            <SensorView />
        </View>
    )
}


export default Tierra;
