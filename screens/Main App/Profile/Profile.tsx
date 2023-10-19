import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { Navigation } from "../../../types/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ProfileSnapMSGs from "./ProfileSnapMSGs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios, { AxiosResponse } from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import ProfileFavourites from "./ProfileFavourites";

const Tab = createMaterialTopTabNavigator();
const { height } = Dimensions.get("window");
const edgeRounding = 25;
const USERS_SEARCH_URL =
  "https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/users/searchuser?user=";

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
  const { onLogout } = useAuth();

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
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const initialUser = {
    profilepic:
      "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
    displayname: "",
    username: "",
    location: "",
    bio: "",
    followers: 0,
    following: 0,
  };

  const [user, setUser] = useState(initialUser);

  return (
    <View>
      {isLoading ? (
        <View
          style={{ justifyContent: "center", marginVertical: height / 2.5 }}
        >
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
            }}
            style={styles.profileImage}
          />

          <View style={styles.userInfoContainer}>
            <View style={styles.displaynameRow}>
              <Text style={styles.displayname}>{user.displayname}</Text>
              <Text
                style={styles.editProfileButton}
                onPress={() => {
                  navigation.navigate("EditProfile");
                }}
              >
                Edit profile
              </Text>
            </View>
            <Text style={styles.bio}>
              {"@"}
              {user.username}
            </Text>

            <Text style={styles.bio}>{user.bio}</Text>
            <Text style={styles.location}>{user.location}</Text>

            <Text style={styles.followCount}>
              <Text style={styles.boldText}>{user.following}</Text> Following
              {"    "}
              <Text style={styles.boldText}>{user.followers}</Text> Followers
            </Text>
          </View>

          <View style={styles.tweetsContainer}>
            <Tab.Navigator
              screenOptions={{
                tabBarIndicatorStyle: {
                  backgroundColor: primaryColor,
                  height: 5,
                },
                tabBarLabelStyle: { fontSize: 15, textTransform: "none" },
                tabBarStyle: {
                  backgroundColor: primaryColor,
                },
              }}
            >
              <Tab.Screen name="SnapMSGs" component={ProfileSnapMSGs} />
              <Tab.Screen name="Favourites" component={ProfileFavourites} />
            </Tab.Navigator>
          </View>
        </View>
      )}
    </View>
  );
};

import { primaryColor } from "../../../components/colors";
import { useAuth } from "../../../context/AuthContext";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 10,
    marginBottom: 15,
  },
  editProfileButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: primaryColor,
    paddingHorizontal: 10,
  },
  userInfoContainer: {
    borderRadius: 5,
    width: "90%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
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
    borderRadius: 5,
    height: height - 165,
    width: "90%",
    backgroundColor: primaryColor,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#FFFFFF",
  },
  displaynameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  location: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
});

export default Profile;
