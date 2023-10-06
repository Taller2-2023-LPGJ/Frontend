import { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    username: string,
    email: string,
    password: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  setLogout?: () => void;
  setLoggedIn?: () => void;
  onRegisterGoogle?: (name: string, email: string) => Promise<any>;
  onLoginGoogle?: (email: string) => Promise<any>;
  setToken?: (token: string) => void;
}

const apiUrl = API_URL;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    
    try {
      const result = await axios.post(`${apiUrl}/users/signup`, {
        username,
        email,
        password,
      });

      return result;
    } catch (e) {
      return { error: true, message: (e as any).response.data.message };
    }
  };

  const login = async (userIdentifier: string, password: string) => {
    try {
      const result = await axios.post(`${apiUrl}/users/signin`, {
        userIdentifier,
        password,
      });

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      // Attach token to header
      axios.defaults.headers.common["token"] = `${result.data.token}`;

      return result;
    } catch (e) {
      return { error: true, message: (e as any).response.data.message };
    }
  };

  const logout = async () => {
    // reset axios header
    axios.defaults.headers.common["token"] = "";

    // remove stored username
    await AsyncStorage.removeItem('username');

    // reset auth state
    setAuthState({
      token: null,
      authenticated: null,
    });
  };

  const registerGoogle = async (name: string, email: string) => {
    try {
      const result = await axios.post(`${apiUrl}/users/signupgoogle`, {
        name,
        email,
      });

      setAuthState({
        token: result.data.token,
        authenticated: false,
      });

      // Attach token to header
      axios.defaults.headers.common["token"] = `${result.data.token}`;

      return result;
    } catch (e) {
      return { error: true,message: (e as any).response.data.message};
    }
  };

  const loginGoogle = async (email: string) => {
    try {
      const result = await axios.post(`${apiUrl}/users/signingoogle`, {
        email,
      });

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      // Attach token to header
      axios.defaults.headers.common["token"] = `${result.data.token}`;
      return result;
    } catch (e) {
      return {error: true,message: (e as any).response.data.message};
    }
  };

  const setAuthIn = () => {
    // update auth state
    setAuthState({
      ...authState,
      authenticated: true,
    });
  };

  const setAuthOut = () => {
    // update auth state
    setAuthState({
      ...authState,
      authenticated: false,
    });
  };

  const setToken = (token: string) => {
    // update token
    setAuthState({
      ...authState,
      token: token,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    setLogout: setAuthOut,
    setLoggedIn: setAuthIn,
    onLoginGoogle: loginGoogle,
    onRegisterGoogle: registerGoogle,
    setToken: setToken,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
