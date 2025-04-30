import Constants from 'expo-constants';

/**
 * Hook para obtener automáticamente la IP local de la laptop en modo Expo
 * @returns string con la IP local, por ejemplo: "192.168.100.5"
 */
export const useLocalIp = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.hostUri;

  if (!hostUri) return null;

  const localIp = hostUri.split(':')[0];
  return localIp;
};
