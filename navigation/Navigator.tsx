import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/Initial Screens/StartScreen";
import Login from "../screens/Initial Screens/Login";
import Register from "../screens/Initial Screens/Register";
import ForgotPassword from "../screens/Initial Screens/ForgotPassword";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { TabNavigator } from "../screens/Main App/TabNavigator";

const Tab = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="StartScreen"
          component={StartScreen}
        />
        <Stack.Screen
          options={{ headerTitleAlign: "center" }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerTitleAlign: "center" }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{ headerTitleAlign: "center" }}
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled: false }}
          name="TabNavigator"
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
