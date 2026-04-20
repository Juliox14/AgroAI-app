export type AuthContextType = {
  loading: boolean;
  session: boolean;
  payload: payload | null;
  signIn: (email: string, password: string) => Promise<Response | undefined>;
  signOut: () => Promise<void>;
  authVerification: () => Promise<void>;
  token: string | null;
};

export type payload = {
  id: number;
  nombre: string;
  email: string;
}

export type DecodedToken = {
  id: number;
  email: string;
  iat: number;
  exp: number;
}