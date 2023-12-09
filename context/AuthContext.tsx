import { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerIndieID } from "native-notify";
import * as SecureStore from "expo-secure-store";

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

const STORED_AUTH = "my-jwt";
const STORED_IDENTIFIER = "my-ui";
const NOTIFICATIONS_API =
  "https://app.nativenotify.com/api/app/indie/sub/16227/F0db46mP8E0ETDYekxQxr0/";
const USERS_SEARCH_URL =
  "https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/users/searchuser?user=";

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
    const result = await SecureStore.getItemAsync(STORED_AUTH);
    if (result !== null) {
      const identifier = await SecureStore.getItemAsync(STORED_IDENTIFIER);

      if (identifier === null) {
        //console.log("no stored identifier...");
        return;
      }

      // Register device to receive notifications
      registerIndieID(identifier, 16227, "F0db46mP8E0ETDYekxQxr0");

      setAuthState({
        token: result,
        authenticated: true,
      });

      // Attach token to header
      axios.defaults.headers.common["token"] = `${result}`;

      return;
    }

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

      try {
        const identifier = await SecureStore.getItemAsync(STORED_IDENTIFIER);
        // Unregister device for notifications'
        if (identifier !== null) {
          await axios.delete(`${NOTIFICATIONS_API}${identifier}`);
        }
      } catch (e) {
        //
      }

      // Store the token
      await SecureStore.setItemAsync(STORED_AUTH, result.data.token);

      // If user logs using his email, fetch the username.
      if (userIdentifier.includes("@")) {
        try {
          const response = await axios.get(
            `${USERS_SEARCH_URL}${userIdentifier}`,
            {}
          );
          const respUsername = response.data.name;

          // Store the identifier
          await SecureStore.setItemAsync(STORED_IDENTIFIER, respUsername);
          // Register device to receive notifications
          registerIndieID(respUsername, 16227, "F0db46mP8E0ETDYekxQxr0");

          try {
            await axios.post(
              "https://t2-gateway-snap-msg-auth-gateway-julianquino.cloud.okteto.net/content/notifications/sendnotificationsforuser",
              {
                respUsername,
              }
            );
          } catch (e) {
            //console.log("error fetching notifications...");
          }
        } catch (e) {
          //
        }
      } else {
        // Store the identifier
        await SecureStore.setItemAsync(STORED_IDENTIFIER, userIdentifier);
        // Register device to receive notifications
        registerIndieID(userIdentifier, 16227, "F0db46mP8E0ETDYekxQxr0");
        try {
          await axios.post(
            "https://t2-gateway-snap-msg-auth-gateway-julianquino.cloud.okteto.net/content/notifications/sendnotificationsforuser",
            {
              userIdentifier,
            }
          );
        } catch (e) {
          //console.log("error fetching notifications...");
        }
      }

      return result;
    } catch (e) {
      return { error: true, message: (e as any).response.data.message };
    }
  };

  const logout = async () => {
    // console.log("Logging out");
    // reset axios header
    axios.defaults.headers.common["token"] = "";

    const identifier = await SecureStore.getItemAsync(STORED_IDENTIFIER);

    // removed stored token
    await SecureStore.deleteItemAsync(STORED_AUTH);

    // remove stored username
    await AsyncStorage.removeItem("username");

    // reset auth state
    setAuthState({
      token: null,
      authenticated: null,
    });

    // Unregister device for notifications
    await axios.delete(`${NOTIFICATIONS_API}${identifier}`);

    // removed stored identifier
    await SecureStore.deleteItemAsync(STORED_IDENTIFIER);
  };

  const registerGoogle = async (name: string, email: string) => {
    try {
      const result = await axios.post(`${apiUrl}/users/signupgoogle`, {
        name,
        email,
      });

      // Attach token to header
      axios.defaults.headers.common["token"] = `${result.data.token}`;

      try {
        const identifier = await SecureStore.getItemAsync(STORED_IDENTIFIER);
        // Unregister device for notifications'
        if (identifier !== null) {
          await axios.delete(`${NOTIFICATIONS_API}${identifier}`);
        }
      } catch (e) {
        //
      }

      setAuthState({
        token: result.data.token,
        authenticated: false,
      });

      try {
        const response = await axios.get(`${USERS_SEARCH_URL}${email}`, {});
        const respUsername = response.data.name;

        // Store the identifier
        await SecureStore.setItemAsync(STORED_IDENTIFIER, respUsername);

        // Store the token
        await SecureStore.setItemAsync(STORED_AUTH, result.data.token);

        // Register device to receive notifications
        registerIndieID(respUsername, 16227, "F0db46mP8E0ETDYekxQxr0");
      } catch (e) {
        //
      }

      return result;
    } catch (e) {
      return { error: true, message: (e as any).response.data.message };
    }
  };

  const loginGoogle = async (email: string) => {
    try {
      const result = await axios.post(`${apiUrl}/users/signingoogle`, {
        email,
      });

      try {
        const identifier = await SecureStore.getItemAsync(STORED_IDENTIFIER);
        // Unregister device for notifications'
        if (identifier !== null) {
          await axios.delete(`${NOTIFICATIONS_API}${identifier}`);
        }
      } catch (e) {
        //
      }

      // Attach token to header
      axios.defaults.headers.common["token"] = `${result.data.token}`;

      setAuthState({
        token: result.data.token,
        authenticated: true,
      });

      try {
        const response = await axios.get(`${USERS_SEARCH_URL}${email}`, {});
        const respUsername = response.data.name;

        // Store the identifier
        await SecureStore.setItemAsync(STORED_IDENTIFIER, response.data.name);

        // Store the token
        await SecureStore.setItemAsync(STORED_AUTH, result.data.token);

        // Register device to receive notifications
        registerIndieID(response.data.name, 16227, "F0db46mP8E0ETDYekxQxr0");

        try {
          await axios.post(
            "https://t2-gateway-snap-msg-auth-gateway-julianquino.cloud.okteto.net/content/notifications/sendnotificationsforuser",
            {
              respUsername,
            }
          );
        } catch (e) {
          // console.log("error fetching notifications...");
        }
      } catch (e) {
        //
      }

      return result;
    } catch (e) {
      return { error: true, message: (e as any).response.data.message };
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
