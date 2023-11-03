import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ProfileStackScreen from "./Profile/ProfileStackScreen";
import FeedStackScreen from "./Feed/FeedStackScreen";
import SearchStackScreen from "./Search/SearchStackScreen";
import SettingsStackScreen from "./Settings/SettingsStackScreen";
import NotificationsStackScreen from "./Notifications/NotificationsStackScreen";
import MessagesStackStackScreen from "./Messages/MessagesStackScreen";
import { getPushDataObject } from "native-notify";
import { useEffect } from "react";

const Tab = createMaterialBottomTabNavigator();

export function TabNavigator() {
  let pushDataObject = getPushDataObject();
  useEffect(() => {
    console.log(pushDataObject);
  }, [pushDataObject]);

  return (
    <Tab.Navigator labeled={true}>
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
        component={FeedStackScreen}
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
        component={SearchStackScreen}
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
        component={ProfileStackScreen}
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
        component={SettingsStackScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                size={25}
                name={props.focused ? "bell-circle" : "bell-circle-outline"}
                {...props}
              />
            );
          },
        }}
        name="Alerts"
        component={NotificationsStackScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon(props) {
            return (
              <Icon
                size={25}
                name={props.focused ? "message" : "message-outline"}
                {...props}
              />
            );
          },
        }}
        name="Messages"
        component={MessagesStackStackScreen}
      />
    </Tab.Navigator>
  );
}
