import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Navigation } from "../../types/types";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const { height } = Dimensions.get("window");
const default_bio = "Welcome to my profile!";
const USERS_SEARCH_URL =
  "https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/searchuser?user=";

const ChooseLocation = ({ navigation }: Props) => {
  const [location, setLocation] = React.useState("");
  const { setLoggedIn } = useAuth();

  const route = useRoute<RouteParams>();
  const data = route.params;
  let username = data.username;

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getUsernameFromEmail();
  }, []);

  const getUsernameFromEmail = async () => {
    if (username.includes("@")) {
      try {
        const response = await axios.get(`${USERS_SEARCH_URL}${username}`, {});
        const respUsername = response.data.name;
        await AsyncStorage.setItem("username", respUsername);
        username = respUsername;
        setisLoading(false);
      } catch (e) {
        // failed to fetch username. Goes to HomeScreen
        await setLoggedIn!();
        navigation.navigate("TabNavigator");
        return;
      }
    } else {
      setisLoading(false);
      return;
    }
  };

  const navigation2 = useNavigation();
  React.useEffect(() =>
    navigation2.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );

  const handleGo = async () => {
    if (location.length === 0) {
      console.log("Blank location...");
    } else {
      if (location.length > 49) {
        alert("Location must be under 50 characters long");
      } else {
        // Update user location
        try {
          const body = {
            username: username,
            displayName: username,
            location: location,
            biography: default_bio,
          };

          await axios.put(`${API_URL}/profile`, body);
        } catch (e) {
          alert((e as any).response.data.message);
        }
      }
    }

    await setLoggedIn!();
    navigation.navigate("TabNavigator");
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
        style={{ justifyContent: "center", marginVertical: height / 2.5 }}
      >
        <ActivityIndicator size="large" animating={true} />
      </View>
    ) : (
      <View>
        <Text style={styles.text} variant="headlineMedium">
          Set your location
        </Text>
        <Text style={{ marginLeft: 0 }} variant="bodyMedium">
          If you'd rather keep your location private, feel free to leave this
          field blank.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Country, City..."
            value={location}
            mode="outlined"
            onChangeText={(location) => setLocation(location)}
          />
        </View>

        <View style={{ alignItems: "flex-end", marginVertical: 10 }}>
          <Button
            style={{ width: width * 0.2, marginVertical: 20 }}
            mode="contained"
            onPress={() => handleGo()}
          >
            Go
          </Button>
        </View>
      </View>)}
    </View>
  );
};

export default ChooseLocation;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    justifyContent: "center",
  },
  text: {
    marginBottom: 5,
    fontSize: width * 0.08,
  },
  inputContainer: {
    marginVertical: 20,
    width: width * 0.85,
  },
});
