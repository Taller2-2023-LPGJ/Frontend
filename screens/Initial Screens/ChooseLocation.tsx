import { Dimensions, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Navigation } from "../../types/types";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { API_URL } from "@env";
import { useRoute } from "@react-navigation/native";

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const default_bio = "Welcome to my profile!";

const ChooseLocation = ({ navigation }: Props) => {

  const [location, setLocation] = React.useState("");
  const { setLoggedIn } = useAuth();

  const route = useRoute<RouteParams>();
  const data = route.params;
  const username = data.username;

  const handleGo = async () => {
    if (location.length === 0) {
      console.log("Blank location...");
    } else {
      if (location.length > 49) {
        alert("Location must be under 50 characters long");
      } else {
        // Update user location
        console.log(username)
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
