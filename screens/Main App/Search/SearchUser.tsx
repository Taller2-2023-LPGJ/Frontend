import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";

const UserProfile = () => {
  return (
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
            <Text style={styles.displayname}>DisplayName </Text>
            <Text style={styles.username}>@Username </Text>
          </View>
          <Text>Bio </Text>
        </View>
      </View>
  )
}


function SearchUser() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UserProfile/>
      <UserProfile/>
      <UserProfile/>
      <UserProfile/>
      <UserProfile/>
      <UserProfile/>
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
    }
});