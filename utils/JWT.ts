export const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    console.log('Payload:', payload);
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}