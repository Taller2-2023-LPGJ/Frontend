import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "react-native-paper";

const Settings = () => {
  const { onLogout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Settings Page</Text>
      <Button onPress={onLogout}> Logout</Button>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
