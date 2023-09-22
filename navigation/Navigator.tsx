import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/Initial Screens/StartScreen";
import Login from "../screens/Initial Screens/Login";
import Register from "../screens/Initial Screens/Register";
import ForgotPassword from "../screens/Initial Screens/ForgotPassword";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { TabNavigator } from "../screens/Main App/TabNavigator";
import { useAuth } from "../context/AuthContext";
import Interests from "../screens/Initial Screens/Interests";
import PinConfirmation from "../screens/Initial Screens/PinConfirmation";
import ChangePassword from "../screens/Initial Screens/ChangePassword";
import ChooseLocation from "../screens/Initial Screens/ChooseLocation";

const Tab = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { authState } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState?.authenticated ? (
          <Stack.Screen
            options={{ headerShown: false, gestureEnabled: false }}
            name="TabNavigator"
            component={TabNavigator}
          />
        ) : (
          <>
            <Stack.Screen
              options={{ headerShown: false }}
              name="StartScreen"
              component={StartScreen}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="Login"
              component={Login}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="Register"
              component={Register}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="ForgotPassword"
              component={ForgotPassword}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="Interests"
              component={Interests}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="PinConfirmation"
              component={PinConfirmation}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="ChangePassword"
              component={ChangePassword}
            />
            <Stack.Screen
              options={{ headerTitleAlign: "center", title: "" }}
              name="ChooseLocation"
              component={ChooseLocation}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
