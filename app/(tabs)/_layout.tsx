import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LayoutTabs() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: "100%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,

                },
                tabBarStyle: {
                    backgroundColor: '#111727',
                    borderRadius: 30,
                    height: 90,
                    justifyContent: 'center',
                    alignItems: 'center',

                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="home-outline"
                            size={28}
                            color={focused ? '#4aad8e' : '#666'}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="plantas"
                options={{
                    title: 'Plantas',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="leaf-outline"
                            size={28}
                            color={focused ? '#4aad8e' : '#666'}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="escanear"
                options={{
                    title: 'Escanear',
                    tabBarIcon: ({ focused }) => (
                        <View className='bg-[#49f19a] rounded-full w-14 h-14 justify-center items-center  p-2'>
                            <Ionicons
                                name="scan-outline"
                                size={28}
                                color="#111727"
                            />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="tierra"
                options={{
                    title: 'Tierra',
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons
                            name="sprout-outline"
                            size={28}
                            color={focused ? '#4aad8e' : '#666'}
                        />
                    )
                }}
            />

            <Tabs.Screen
                name="configuracion"
                options={{
                    title: 'Configuración',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="settings-outline"
                            size={28}
                            color={focused ? '#4aad8e' : '#666'}
                        />
                    )
                }}
            />
        </Tabs>
    );
}
