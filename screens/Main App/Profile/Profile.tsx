import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Image, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { Navigation } from "../../../types/types";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileSnapMSGs from "./ProfileSnapMSGs";
import ProfileLikes from "./ProfileLikes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import axios, { AxiosResponse } from "axios";


const Tab = createMaterialTopTabNavigator();
const { height } = Dimensions.get("window");
const edge_rounding = 25

interface ProfileProps {
  navigation: Navigation;
}

const Profile = ({ navigation }: ProfileProps) => { 
  const getData = async () => { 
    const result = await AsyncStorage.getItem('username');
    if (result != null) {
      let api_result: AxiosResponse<any, any>
      try {
        api_result = await axios.get(`${API_URL}/profile/${result}`);
        setUser((prevData: any) => ({...prevData, username: result, displayname: api_result.data.displayName, bio: api_result.data.biography}))
      } catch (e) {
        alert((e as any).response.data.message)
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const initialUser = {
    profilepic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    displayname: "John Doe",
    username: "",
    location: "Buenos Aires",
    bio: "Software Developer",
    birthdate: "January 1, 2000",
    followers: 10,
    following: 6,
  };

  const [user, setUser] = useState(initialUser);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri:
            user.profilepic,
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
        <Text style={styles.bio}>{"@"}{user.username}</Text>
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

      
      <View style={styles.tweetsContainer}>
        <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle:{backgroundColor:"#739998", height:5},
          tabBarLabelStyle: { fontSize: 15, textTransform: "none"},
          tabBarStyle: { backgroundColor: "#cfcfcf", borderTopLeftRadius: edge_rounding, borderTopRightRadius: edge_rounding },
        }}
        >
          <Tab.Screen name="SnapMSGs" component={ProfileSnapMSGs} />
          <Tab.Screen name="Likes" component={ProfileLikes} />
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderRadius: 10,
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
    borderTopLeftRadius: edge_rounding,
    borderTopRightRadius: edge_rounding,
    height: height - 165,
    width: "90%",
    backgroundColor: "#ccc",
  },
});

export default Profile;



