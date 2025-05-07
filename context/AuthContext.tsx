import { useContext, createContext, useState } from "react";
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
  authVeryfication: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ( { children }:{children: React.ReactNode} ) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(false);
  const [user, setUser] = useState<User | null>(null);  
  
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log("Tu putamadre", email, password);
    try {
      const res = await fetch("http://192.168.100.47:3000/auth/login", {
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

  };

  const authVeryfication = async () => {
    setLoading(true);
    const token = await getItemAsync('token');

    console.log("Token", token);

    try{
      const res = await fetch("http://192.168.100.47:3000/auth", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(res.status.toString(), data.message);
        setLoading(false);
        return;
      }
      
      setSession(true);
      setLoading(false);
    }catch(error){
      console.error('Error al verificar la sesión', error);
      Alert.alert('Error', 'No se pudo verificar la sesión. Intenta de nuevo más tarde.');
    }
  }

  const contextData = { user, loading, session, signIn, signOut, authVeryfication };

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