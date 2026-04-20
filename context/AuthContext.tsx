import { payload, AuthContextType } from "@/types/auth";

import { useContext, createContext, useState, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { decodeJWT } from "@/utils/JWT";
import { SafeAreaView } from "react-native-safe-area-context";


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);
  const [payload, setPayload] = useState<payload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.mensaje || 'Credenciales inválidas');
        setLoading(false);
        return; 
      }

      setPayload(data.user);
      setToken(data.token);
      await setItemAsync('token', data.token);

      setSession(true);
      return res;

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await deleteItemAsync('token');
      setSession(false);
      setPayload(null);
      setToken(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const authVerification = async () => {
    try {
      const storedToken = await getItemAsync('token');

      if (!storedToken) {
        setSession(false);
        return;
      }

      const decodedToken = decodeJWT(storedToken);
      const nowInSeconds = Math.floor(Date.now() / 1000);

      if (nowInSeconds >= decodedToken.exp) {
        console.log("El token expiró");
        await signOut();
        return;
      }

      const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/api/auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setSession(false);
        return;
      }

      setToken(storedToken);
      
      if (data.user) {
        setPayload(data.user);
      } else {
        setPayload(decodedToken as payload); 
      }
      
      setSession(true);

    } catch (error) {
      console.error('Error al verificar la sesión', error);
      setSession(false);
    } finally {
      setIsReady(true);
    }
  }

  useEffect(() => {
    authVerification();
  }, []);

  const contextData = { 
    isReady, 
    loading, 
    session, 
    payload, 
    token, 
    signIn, 
    signOut, 
    authVerification 
  };

  if (!isReady) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  return (
    <AuthContext.Provider value={contextData as any}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };