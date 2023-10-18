import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "react-native-paper";

import { API_URL } from "@env";
import axios from "axios";

const { width } = Dimensions.get("window");

const Settings = () => {
  const { onLogout } = useAuth();

  const handleVerifyRequest = async () => {
    // TODO gateway (usar API_URL)
    const fullUrl = `https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/users/askforverification`;
    try {
      const response = await axios.post(fullUrl, {
        username: "lucas123", ///// Para testing. Borrar
        action: "Yes",
      });
      alert("Your profile is now pending verification.");
    } catch (e) {
      // Si la peticion no es valida, devolver error
      alert((e as any).response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
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
  },
  buttonLogout: {
    width: width * 0.8,
    borderRadius: 0,
    backgroundColor: "#FF6B6B",
  },
  buttonVerify: {
    marginTop: 20,
    marginBottom: 20,
    width: width * 0.8,
    borderRadius: 0,
  },
  text: {
    fontSize: width * 0.065,
    marginTop: 30,
    color: "white",
    fontWeight: "bold",
  },
});
