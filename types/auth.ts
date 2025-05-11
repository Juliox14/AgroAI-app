export type AuthContextType = {
  loading: boolean;
  session: boolean;
  payload: payload | null;
  signIn: (email: string, password: string) => Promise<Response | undefined>;
  signOut: () => Promise<void>;
  authVerification: () => Promise<void>;
};

export type payload = {
  exp: number;
  iat: number;
  id: number;
  name: string;
}