import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");

const Settings = () => {
  const { onLogout } = useAuth();

  return (
    <View style={styles.container}>
      <Button style={styles.button} onPress={onLogout} mode="contained">  Logout</Button>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },button: {
    marginTop: 30,
    width: width * 0.8,
    borderRadius: 0,
  },
});
