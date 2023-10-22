import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "react-native-paper";
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
      alert((e as any).response.data.message);
    }
  };

  // // Logs out & stops receiving notifications for this user
  // const handleRemoveAccountFromDevice = async () => {
  //   const username = await AsyncStorage.getItem("username");
  //   unregisterIndieDevice(username, 13586, 'SKYebTHATCXWbZ1Tlwlwle');
  //   onLogout!()
  // }

  return (
    <View style={styles.container}>
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

      {/*<Button style={styles.buttonLogout} onPress={handleRemoveAccountFromDevice} mode="contained">
        Logout & Remove Account
  </Button>*/}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor:background
  },
  buttonLogout: {
    width: width * 0.5,
    backgroundColor: "#FF6B6B",
  },
  buttonVerify: {
    marginTop: 20,
    marginBottom: 20,
    width: width * 0.5,
  },
  text: {
    fontSize: width * 0.065,
    marginTop: 30,
    color: "white",
    fontWeight: "bold",
  },
});
