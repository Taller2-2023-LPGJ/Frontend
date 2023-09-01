import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Feed from "./Feed";
import Search from "./Search";
import Profile from "./Profile";
import Settings from "./Settings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                size={25}
                name={props.focused ? "home-circle" : "home-circle-outline"}
                {...props}
              />
            );
          },
        }}
        name="Feed"
        component={Feed}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                size={25}
                name={props.focused ? "card-search" : "card-search-outline"}
                {...props}
              />
            );
          },
        }}
        name="Search"
        component={Search}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                size={25}
                name={
                  props.focused ? "account-circle" : "account-circle-outline"
                }
                {...props}
              />
            );
          },
        }}
        name="Profile"
        component={Profile}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                size={25}
                name={props.focused ? "cog" : "cog-outline"}
                {...props}
              />
            );
          },
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
}
