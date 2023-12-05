import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { Navigation } from "../../types/types";
import Logo from "../../components/Logo";
import { StatusBar } from "expo-status-bar";
import { background, primaryColor, textLight } from "../../components/colors";
import { useAuth } from "../../context/AuthContext";
import * as SecureStore from "expo-secure-store";

type Props = {
  navigation: Navigation;
};

const STORED_AUTH = "my-jwt";
const { width } = Dimensions.get("window");

const StartScreen = ({ navigation }: Props) => {
  const { onLogin } = useAuth();

  // Try to log in using stored data
  const handleEffect = async () => {
    const result = await SecureStore.getItemAsync(STORED_AUTH);
    if (result !== null) {
      await onLogin!("", "");
    } else {
      console.log("null stored token...")
    }
  };

  useEffect(() => {
    handleEffect();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topContainer}>
        <Logo />

        <Text style={styles.text}>
          See what's happening in the world right now.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          labelStyle={{ color: textLight }}
          mode="contained"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>

        <Button
          style={styles.button}
          labelStyle={{ color: textLight }}
          mode="contained"
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: background,
  },
  button: {
    width: width * 0.7,
    marginVertical: 10,
    backgroundColor: primaryColor,
  },
  text: {
    fontSize: width * 0.065,
    marginTop: 0,
  },
  buttonContainer: {
    marginTop: 60,
    flexDirection: "column",
  },
  topContainer: {
    flex: 9 / 10,
    alignItems: "center",
    padding: 10,
  },
  subtitle: {
    fontSize: width * 0.04,
    marginTop: 0,
  },
});
