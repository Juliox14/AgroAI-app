import { useContext, createContext, useState, useEffect } from "react";
import { SafeAreaView, View, ActivityIndicator, Alert } from "react-native";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";

type User = {
  name: string;
};


type AuthContextType = {
  user: User | null;
  loading: boolean;
  session: boolean;
  signIn: (email: string, password: string) => Promise<Response | undefined>;
  signOut: () => Promise<void>;
  authVerification: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ( { children }:{children: React.ReactNode} ) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);
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
        Alert.alert('Error', data.body.message);
        return;
      }

      await setItemAsync('token', data.body.token);

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
  
    console.log("Token", token);
  
    if (!token) {
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
  
      const data = await res.json();
  
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

  const contextData = { user, loading, session, signIn, signOut, authVerification };

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