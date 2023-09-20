import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

const UserProfile = () => {
  const handlePress = () => {
    console.log("Opened profile")
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
          <Text style={styles.displayname}>DisplayName </Text>
          <Text style={styles.username}>@Username </Text>
        </View>
        <Text>Bio </Text>
      </View>
      </View>
    </TouchableWithoutFeedback >
    
  )
}


function SearchUser() {

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
    },
    buttonContainer:{
      width: "100%",
      alignItems: "center",
    }
});