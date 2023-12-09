import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/Navigator";
import { Provider, adaptNavigationTheme } from "react-native-paper";
import { DarkTheme } from "@react-navigation/native";
import { MD3DarkTheme } from "react-native-paper";
import merge from "deepmerge";

import registerNNPushToken from "native-notify";
import { useEffect } from "react";

// merge react-native-paper and react-navigation themes
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export default function App() {
  
  //registerNNPushToken(13586, "SKYebTHATCXWbZ1Tlwlwle");
  registerNNPushToken(16227, 'F0db46mP8E0ETDYekxQxr0');

  return (
    <AuthProvider>
      <Provider theme={CombinedDarkTheme}>
        <AppNavigator />
      </Provider>
    </AuthProvider>
  );
}
