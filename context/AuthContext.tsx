// types
import { responseAuth } from "@/interfaces/response.auth";
import { payload, User, AuthContextType } from "@/types/auth";

import { useContext, createContext, useState, useEffect } from "react";
import { SafeAreaView, View, ActivityIndicator, Alert } from "react-native";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { decodeJWT } from "@/utils/JWT";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ( { children }:{children: React.ReactNode} ) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);
  const [payload, setPayload] = useState<payload | null>(null);
  const [user, setUser] = useState<User | null>(null);  

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message);
        return;
      }

      setPayload(data.user);
      console.log("Payload", data.user);
      await setItemAsync('token', data.token);

      setUser({ name: "Test" });
      setSession(true);
      setLoading(false);

      return res;
    } catch (error) { 
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await deleteItemAsync('token');
      setUser(null);
      setSession(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const authVerification = async () => {
    setLoading(true);
    const token = await getItemAsync('token');
    
    if (!token) {
      setSession(false);
      setLoading(false);
      return;
    }
    
    const decodedToken = decodeJWT(token);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    const diffMinutes = (nowInSeconds - decodedToken.exp) / Math.floor(60);

    if(diffMinutes > 10){
      setSession(false);
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data = await res.json() as responseAuth;
      setPayload(data.payload);
  
      if (!res.ok) {
        Alert.alert(res.status.toString(), data.message);
        setSession(false);
        setLoading(false);
        return;
      }
      
      setSession(true);
      setLoading(false);
    } catch(error) {
      console.error('Error al verificar la sesión', error);
      Alert.alert('Error', 'No se pudo verificar la sesión. Intenta de nuevo más tarde.');
      setSession(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    authVerification();
  }, []);

  const contextData = { user, loading, session, payload, signIn, signOut, authVerification };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ?( 
        <SafeAreaView className="flex-1">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        </SafeAreaView> 
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };