import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from '../../../types/types';
import { background, primaryColor, secondaryColor, tertiaryColor, textLight } from '../../../components/colors';
import { useAuth } from '../../../context/AuthContext';

interface User {
  displayName: string;
  username: string;
}

type Props = {
  navigation: Navigation;
};

const SearchSnapMSG = ({ navigation }: Props) => {
  const { onLogout } = useAuth();

  const navigation2 = useNavigation();


  React.useEffect(() =>
  navigation2.addListener("beforeRemove", (e) => {
    e.preventDefault();
  })
  );

  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    let api_result: AxiosResponse<any, any>

      try {
        //api_result = await axios.get(`${API_URL}/content/post?body=${searchQuery}`);
        api_result = await axios.get(`${API_URL}/content/follow/pablom/followed?page=0`);
        console.log(api_result.data)
        //setUsers(api_result.data)
      } catch (e) {
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }
  }


  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
  const onSubmitEditing = (_: any) => getUsers()


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Searchbar
      style={styles.searchBar}
      placeholder="Search"
      onChangeText={onChangeSearch}
      onSubmitEditing={onSubmitEditing}
      placeholderTextColor={textLight}
      inputStyle={{ color: textLight }}
      onClearIconPress={() => {
        setUsers([])
      }}
      value={searchQuery} />
      {users.map((user, index) => (
        null
      ))}
    </ScrollView>
  );
}

export default SearchSnapMSG;


const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: 5,
      backgroundColor:background,
      flexGrow:1
    },
    userProfileContainer: {
      width: "90%",
      backgroundColor: tertiaryColor,
      padding: 15,
      borderRadius: 20,
      marginVertical: 8,
      flexDirection: "row",
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 75,
      marginRight: 15
    },
    displayname: {
      fontSize: 18,
      fontWeight: "bold",
      color:textLight,
    },
    username: {
      fontSize: 15,
      color:textLight,
    },
    namesContainer:{
      flexDirection:"column",
    },
    buttonContainer:{
      width: "100%",
      alignItems: "center",
    },
    searchBar: {
      width: '90%',
      alignSelf: 'center',
      marginBottom: 10,
      marginTop: 10,
      backgroundColor: primaryColor,
    },
});