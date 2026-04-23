import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import './globals.css';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#111827', // Tailwind gray-900
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="results/NDVIResult"
          options={{
            headerShown: false,

          }}
        />

        <Stack.Screen
          name="parcela/[id]"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="parcelas/nueva-parcela"
          options={{ headerShown: false }}
        />

      </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}