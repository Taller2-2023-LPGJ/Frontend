import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-paper";
import { Navigation } from "../../../navigation/types";


interface ProfileProps {
  navigation: Navigation;
}

const Profile = ({ navigation }: ProfileProps) => {
  
  const user = {
    displayname: "John Doe",
    username: "@johndoe123",
    location: "Buenos Aires",
    bio: "Software Developer",
    birthdate: "January 1, 2000",
    followers: 10,
    following: 6,
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        }}
        style={styles.profileImage}
      />

      <Button
        style={styles.editProfileButton}
        mode="outlined"
        onPress={() => {
          navigation.navigate("EditProfile")
        }}
      >
        Edit profile
      </Button>

      
      <View style={styles.userInfoContainer}>
        <Text style={styles.displayname}>{user.displayname}</Text>
        <Text style={styles.bio}>{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <Text>
          <Text style={styles.bio}>{user.location}</Text>{", "}
          <Text style={styles.bio}>{user.birthdate}</Text>
        </Text>
        
        <Text style={styles.followCount}>
          <Text style={styles.boldText}>{user.following}</Text> following{" "}
          <Text style={styles.boldText}>{user.followers}</Text> followers
        </Text>
      </View>

      
      <View style={styles.tweetsContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 75,
    marginTop: 55,
    marginBottom: 15,
  },
  editProfileButton: {
    marginBottom: 15,
    width: 120,
    height: 45,
  },
  userInfoContainer: {
    backgroundColor: "#ccc",
    width: "90%",
    padding: 10,
    marginBottom: 10,
  },
  displayname: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 16,
    marginTop: 5,
  },
  followCount: {
    fontSize: 16,
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  tweetsContainer: {
    flex: 1,
    width: "90%",
    backgroundColor: "#ccc",
  },
});

export default Profile;
