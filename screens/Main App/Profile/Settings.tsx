import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios from "axios";
import { unregisterIndieDevice } from "native-notify";
import { background } from "../../../components/colors";

const { width } = Dimensions.get("window");

const Settings = () => {
  const { onLogout } = useAuth();
  const handleVerifyRequest = async () => {
    // TODO gateway (usar API_URL) que no requiere username en body
    const username = await AsyncStorage.getItem("username");
    const fullUrl = `https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/users/askforverification`;
    try {
      const response = await axios.post(fullUrl, {
        username: username,
        action: "Yes",
      });
      alert("Your profile is now pending verification.");
    } catch (e) {
      if ((e as any).response.status == "401" || (e as any).response.data.message.includes("blocked")) {
        onLogout!();
        alert((e as any).response.data.message);
      } else {
        alert((e as any).response.data.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>About:</Text>
        <Text style={styles.paragraph}>
          Once a verification request is submitted, you will need to await
          approval or rejection from an administrator.
        </Text>
        <Text style={styles.paragraph}>
          If the verification is rejected, you may then proceed to reattempt the
          verification of your profile.
        </Text>
      </View>
      <Button
        style={styles.buttonVerify}
        onPress={handleVerifyRequest}
        mode="contained"
      >
        Verify Profile
      </Button>

      <Button style={styles.buttonLogout} onPress={onLogout} mode="contained">
        Logout
      </Button>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: background,
  },
  infoContainer: {
    marginLeft:10,
  },
  paragraph: {
    marginTop:5,
    fontSize: 18
  },
  buttonLogout: {
    width: width * 0.7,
    backgroundColor: "#FF6B6B",
  },
  buttonVerify: {
    marginTop: 30,
    marginBottom: 20,
    width: width * 0.7,
  },
  text: {
    fontSize: width * 0.065,
    marginTop: 30,
    color: "white",
    fontWeight: "bold",
  },
});
