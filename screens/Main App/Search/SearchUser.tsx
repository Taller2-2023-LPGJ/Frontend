import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Searchbar } from 'react-native-paper';

interface User {
  displayname: string;
  username: string;
  bio: string;
}


const UserProfile: React.FC<{ user: User }> = ({ user }) => {

  const handlePress = () => {
    console.log("Opened " + user.username + "'s profile")
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
          <Text style={styles.displayname}>{user.displayname} </Text>
          <Text style={styles.username}>{user.username} </Text>
        </View>
        <Text>{user.bio} </Text>
      </View>
      </View>
    </TouchableWithoutFeedback >
    
  )
}


function SearchUser() {
  const navigation = useNavigation();

  React.useEffect(() =>
  navigation.addListener("beforeRemove", (e) => {
    e.preventDefault();
  })
  );

  const initialUsers = [
    {
      displayname: "John Doe",
      username: "@johndoe123",
      bio: "Software Developer",
    },
    {
      displayname: "Jane Doe",
      username: "@sdas123",
      bio: "Ssaddasr",
    },
  ];

  const [users, setUsers] = useState(initialUsers);

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
  const onSubmitEditing = (_: any) => setUsers(initialUsers)

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
      value={searchQuery} />
      {users.map((user, index) => (
        <UserProfile key={index} user={user} />
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
      fontSize: 15,
      fontWeight: "bold",
    },
    username: {
      fontSize: 15,
    },
    namesContainer:{
      flexDirection:"row"
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