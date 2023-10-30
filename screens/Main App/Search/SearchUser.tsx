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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface User {
  displayName: string;
  username: string;
  profilePicture: string;
  verified: boolean;
}

type Props = {
  navigation: Navigation;
};


const UserProfile: React.FC<{ user: User, navigation: Navigation }> = ({ user,navigation }) => {
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
            user.profilePicture,
        }}
        style={styles.profileImage}
      />
      <View>
        <View style={styles.namesContainer}>
          <Text style={styles.displayname}>{user.displayName} 
          {user.verified ? <Icon size={(15)} color={textLight} style={{marginTop:5, marginLeft:15}} name="check-decagram" /> : null}
          </Text>
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
        api_result = await axios.get(`${API_URL}/profile?user=${searchQuery}`);
        setUsers(api_result.data)
      } catch (e) {
        const { onLogout } = useAuth();
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
        <UserProfile key={index} user={user} navigation={navigation}/>
      ))}
    </ScrollView>
  );
}

export default SearchUser;


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