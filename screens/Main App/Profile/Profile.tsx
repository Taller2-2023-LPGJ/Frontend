import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Image, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { Navigation } from "../../../types/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileSnapMSGs from "./ProfileSnapMSGs";
import ProfileLikes from "./ProfileLikes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios, { AxiosResponse } from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";

const Tab = createMaterialTopTabNavigator();
const { height } = Dimensions.get("window");
const edgeRounding = 25;
const USERS_SEARCH_URL =
  "https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/searchuser?user=";

interface ProfileProps {
  navigation: Navigation;
}

const Profile = ({ navigation }: ProfileProps) => {
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const [isLoading, setisLoading] = useState(true);

  const getData = async () => {
    let result = await AsyncStorage.getItem("username");

    if (!result) {
      alert("User not found");
      return;
    }

    if (result.includes("@")) {
      try {
        const response = await axios.get(`${USERS_SEARCH_URL}${result}`, {});
        const username = response.data.name;
        await AsyncStorage.setItem("username", username);
        result = username;
      } catch (e) {
        alert((e as any).response.data.message);
        return;
      }
    }

    if (result != null) {
      let api_result: AxiosResponse<any, any>;
      try {
        api_result = await axios.get(`${API_URL}/profile/${result}`);
        setUser((prevData: any) => ({
          ...prevData,
          username: result,
          location: api_result.data.location,
          displayname: api_result.data.displayName,
          bio: api_result.data.biography,
        }));
        setisLoading(false);
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const initialUser = {
    profilepic:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    displayname: "",
    username: "",
    location: "",
    bio: "",
    birthdate: "",
    followers: 0,
    following: 0,
  };

  const [user, setUser] = useState(initialUser);

  return (
    <View>
      {isLoading ? (
        <View
          style={{ justifyContent: "center", marginVertical: height / 2.5 }}>
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={{
              uri: user.profilepic,
            }}
            style={styles.profileImage}
          />

          <Button
            style={styles.editProfileButton}
            mode="outlined"
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
          >
            Edit profile
          </Button>

          <View style={styles.userInfoContainer}>
            <Text style={styles.displayname}>{user.displayname}</Text>
            <Text style={styles.bio}>
              {"@"}
              {user.username}
            </Text>
            <Text style={styles.bio}>{user.bio}</Text>
            <Text>
              <Text style={styles.bio}>{user.location}</Text>
              {", "}
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
                tabBarIndicatorStyle: { backgroundColor: "#739998", height: 5 },
                tabBarLabelStyle: { fontSize: 15, textTransform: "none" },
                tabBarStyle: {
                  backgroundColor: "#cfcfcf",
                  borderTopLeftRadius: edgeRounding,
                  borderTopRightRadius: edgeRounding,
                },
              }}
            >
              <Tab.Screen name="SnapMSGs" component={ProfileSnapMSGs} />
              <Tab.Screen name="Likes" component={ProfileLikes} />
            </Tab.Navigator>
          </View>
        </ScrollView>
      )}
    </View>
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
    borderTopLeftRadius: edgeRounding,
    borderTopRightRadius: edgeRounding,
    height: height - 165,
    width: "90%",
    backgroundColor: "#ccc",
  },
});

export default Profile;
