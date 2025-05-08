import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { Ionicons } from '@expo/vector-icons'


const CircleProgress = ({
  size = 60,
  strokeWidth = 6,
  progress = 0.14,           // 14%
  color = '#4ade80',          // color del progres o
  backgroundColor = '#d1fae5' // color del anillo de fondo
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  return (
    <Svg width={size} height={size}>
      {/* Anillo de fondo */}
      <Circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Anillo de progreso */}
      <Circle
        cx={size/2}
        cy={size/2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size/2}, ${size/2}`}
      />
    </Svg>
  )
}

interface ResultProps {
  nameIcon?: any
  value?: number
  label?: string
}


const Result = ({ nameIcon = 'water', value = 0.42, label = 'Estrés hídrico' }: ResultProps ) => {

  return (
    <View className="flex-row rounded-2xl items-center justify-between bg-white p-4 shadow-sm w-auto">
      <View className="justify-center p-4">
        <Ionicons name={nameIcon} size={24} color="#4ade80" />
        <Text className="text-2xl font-bold">{value}%</Text>
        <Text className="text-sm text-gray-500">{label}</Text>
      </View>

      <View className="relative items-center justify-center p-4">
        <CircleProgress size={70} strokeWidth={8} progress={value / 100} />
        <Text className="absolute text-sm font-semibold text-gray-700">
          {value}%
        </Text>
      </View>
    </View>
  )
}

export default Result
