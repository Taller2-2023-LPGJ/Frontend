import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from "@react-navigation/native";
import SearchUser from './SearchUser';
import SearchHashtag from './SearchHashtag';
import SearchSnapMSG from "./SearchSnapMSG";
import { Searchbar } from 'react-native-paper';


const Tab = createMaterialTopTabNavigator();

const Search = () => {
  const navigation = useNavigation();

  React.useEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
  const onSubmitEditing = (_: any) => console.log("User searched: " + searchQuery) // Acá habría que buscar

  return (
    <><Searchbar
      style={styles.searchBar}
      placeholder="Search"
      onChangeText={onChangeSearch}
      onSubmitEditing={onSubmitEditing}
      value={searchQuery} />
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle:{backgroundColor:"#739998", height:5},
          tabBarLabelStyle: { fontSize: 15, textTransform: "none"},
          tabBarStyle: { backgroundColor: "#cfcfcf" },
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
