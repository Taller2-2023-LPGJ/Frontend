import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from "@react-navigation/native";
import SearchUser from './SearchUser';
import SearchSnapMSG from "./SearchSnapMSG";
import { Searchbar } from 'react-native-paper';
import { accent, primaryColor, secondaryColor } from "../../../components/colors";


const Tab = createMaterialTopTabNavigator();

const Search = () => {
  
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle:{backgroundColor:accent, height:5},
          tabBarLabelStyle: { fontSize: 15, textTransform: "none"},
          tabBarStyle: { backgroundColor: primaryColor },
        }}
      >
        <Tab.Screen name="Users" component={SearchUser} />
        <Tab.Screen name="SnapMSG" component={SearchSnapMSG} />
      </Tab.Navigator></>
  );
};

export default Search;

