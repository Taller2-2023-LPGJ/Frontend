import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from "@react-navigation/native";
import SearchUser from './SearchUser';
import SearchHashtag from './SearchHashtag';
import SearchSnapMSG from "./SearchSnapMSG";


const Tab = createMaterialTopTabNavigator();

const Search = () => {
  const navigation = useNavigation();

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle:{backgroundColor:"#739998", height:5},
          tabBarLabelStyle: { fontSize: 15, textTransform: "none"},
          tabBarStyle: { backgroundColor: "#EDF2F4" },
        }}
      >
        <Tab.Screen name="Users" component={SearchUser} />
        <Tab.Screen name="Hashtag" component={SearchHashtag} />
        <Tab.Screen name="SnapMSG" component={SearchSnapMSG} />
      </Tab.Navigator></>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchBar: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#cfcfcf",
  },
});
