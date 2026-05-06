import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function LayoutTabs() {

    const { session } = useAuth();
    const { colorScheme } = useColorScheme();

    return (
        <>
            {session ? (
                <Tabs
                    // @ts-ignore - sceneContainerStyle is omitted from Expo Router types
                    sceneContainerStyle={{ backgroundColor: colorScheme === 'dark' ? '#111827' : '#f9fafb' }}
                    screenOptions={{
                        tabBarShowLabel: true,
                        tabBarItemStyle: {
                            width: '100%',
                            height: "100%",
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,

                        },
                        tabBarStyle: {
                            backgroundColor: '#111727',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            height: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }
                    }}>
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
                        name="parcelas"
                        options={{
                            title: 'Parcelas',
                            headerShown: false,
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
                        name="camara/calibracion"
                        options={{
                            title: ' ',
                            headerShown: false,
                            tabBarStyle: { display: 'none' },
                            tabBarIcon: ({ focused }) => (
                                <View className='bg-[#49f19a] rounded-full w-14 h-14 justify-center items-center  p-2'>
                                    <Ionicons
                                        name="scan-outline"
                                        size={28}
                                        color="#111727"
                                    />
                                </View>
                            ),

                        }}
                    />
                    <Tabs.Screen
                        name="camara/index"
                        options={{
                            href: null,
                            headerShown: false,
                        }}
                    />
                    <Tabs.Screen
                        name="estadisticas"
                        options={{
                            title: 'Estadísticas',
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <Ionicons
                                    name="stats-chart-outline"
                                    size={28}
                                    color={focused ? '#4aad8e' : '#666'}
                                />
                            )
                        }}
                    />

                    <Tabs.Screen
                        name="configuracion"
                        options={{
                            title: 'Ajustes',
                            headerShown: false,
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
            ) : (
                <Redirect href="/login" />
            )}
        </>
    );
}

