import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from '../../../types/types';

interface User {
  displayName: string;
  username: string;
}

type Props = {
  navigation: Navigation;
};


const UserProfile: React.FC<{ user: User, navigation: Navigation }> = ({ user,navigation }) => {
  //const navigation = useNavigation()


  const handlePress = async () => {
    let username = await AsyncStorage.getItem('username');
    if (username == user.username){
      navigation.navigate("Profile")
    } else {
      navigation.navigate("OtherProfile", {username: user.username})
    }
  };
  return (
    <TouchableWithoutFeedback  onPress={handlePress} style={styles.buttonContainer}>
      <View style={styles.userProfileContainer}>
      <Image
        source={{
          uri:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }}
        style={styles.profileImage}
      />
      <View>
        <View style={styles.namesContainer}>
          <Text style={styles.displayname}>{user.displayName} </Text>
          <Text style={styles.username}>{"@"}{user.username} </Text>
        </View>
      </View>
      </View>
    </TouchableWithoutFeedback >
  )
}

const SearchUser = ({ navigation }: Props) => {

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
        api_result = await axios.get(`${API_URL}/profile?username=${searchQuery}`);
        setUsers(api_result.data)
      } catch (e) {
        alert((e as any).response.data.message)
      }
  }


  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
  const onSubmitEditing = (_: any) => getUsers()

  const [isPressEnabled, setIsPressEnabled] = useState(true);
  const handleScrollBegin = () => {
    // Disable pressing when scrolling begins
    setIsPressEnabled(false);
  };
  const handleScrollEnd = () => {
    // Enable pressing when scrolling ends
    setIsPressEnabled(true);
  };


  return (
    <ScrollView contentContainerStyle={styles.container}
      onScrollBeginDrag={handleScrollBegin}
      onScrollEndDrag={handleScrollEnd}
    >
      <Searchbar
      style={styles.searchBar}
      placeholder="Search"
      onChangeText={onChangeSearch}
      onSubmitEditing={onSubmitEditing}
      onClearIconPress={() => {
        setUsers([])
      }}
      value={searchQuery} />
      {users.map((user, index) => (
        <UserProfile key={index} user={user} navigation={navigation}/>
      ))}
    </ScrollView>
  );
}

export default SearchUser;


const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: 5
    },
    userProfileContainer: {
      width: "95%",
      backgroundColor: "#ccc",
      padding: 15,
      borderRadius: 20,
      marginVertical: 5,
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
    },
    username: {
      fontSize: 15,
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
      backgroundColor: "#cfcfcf",
    },
});