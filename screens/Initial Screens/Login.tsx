import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput, Text } from "react-native-paper";
import { Navigation } from "../../types/types";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

type Props = {
  navigation: Navigation;
};

const GOOGLE_ERR_MSG = "Error fetching from Google. Please try again";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

const Login = ({ navigation }: Props) => {
  const [identifier, setIdentifier] = React.useState("");
  const [pass, setPass] = React.useState("");
  const { onLogin, onLoginGoogle } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "463820808275-tjqtu14eadrj8cvhig35seb0luvprp15.apps.googleusercontent.com",
    webClientId:
      "463820808275-1e2fcu04hn09dvcn8aujhl1op5hlhbep.apps.googleusercontent.com",
  });

  const login = async () => {
    if (identifier === "" || pass === "") {
      Alert.alert("Error", "Empty input fields.");
      return false;
    }

    const result = await onLogin!(identifier, pass);

    if (result && result.error) {
      alert(result.message);
    } else {
      await AsyncStorage.setItem("username", identifier);
      navigation.navigate("TabNavigator");
    }
  };

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {

    let userInfo = null;
    if (response?.type === "success" && response.authentication) {
      userInfo = await getUserInfo(response.authentication.accessToken);
    } else {
      return;
    }
    let email = null;
    if (userInfo !== null) {
      email = (userInfo as any).email;
    } else {
      alert(GOOGLE_ERR_MSG);
      return;
    }
    let result = null;
    if (email) {
      result = await onLoginGoogle!((userInfo as any).email);
    } else {
      alert(GOOGLE_ERR_MSG);
      return;
    }

    if (result && result.error) {
      alert(GOOGLE_ERR_MSG);
    } else {
      await AsyncStorage.setItem("username", email);
      navigation.navigate("TabNavigator");
    }
  }

  const getUserInfo = async (token: string) => {

    if (!token) return;
    try {
      const response = await axios.get(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userInfo = await response.data;
      return userInfo;

    } catch (error) {
      alert(GOOGLE_ERR_MSG);
      return null;
    }
  };

  const handleGoogleSignIn = async () => {
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        Welcome!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Username or email"
          value={identifier}
          mode="outlined"
          style={{ marginBottom: 10 }}
          onChangeText={(mail) => setIdentifier(mail)}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={pass}
          onChangeText={(pass) => setPass(pass)}
        />
      </View>

      <Text
        style={{ marginLeft: width * 0.35, fontWeight: "bold" }}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        Forgot your password?
      </Text>

      <Button
        style={{ width: width * 0.65, marginVertical: 20 }}
        mode="contained"
        onPress={() => login()}
      >
        Login
      </Button>

      <Button
        style={{ width: width * 0.65, marginVertical: 0 }}
        mode="contained"
        onPress={() => {
          handleGoogleSignIn();
        }}
        icon="google"
      >
        Login with Google
      </Button>

      <View style={{ flexDirection: "row", marginVertical: 25 }}>
        <Text>Don't have an account?</Text>
        <Text
          style={{ fontStyle: "italic", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Register")}
        >
          {" "}
          Sign up
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 10,
    fontSize: width * 0.05,
  },
  inputContainer: {
    marginVertical: 10,
    width: width * 0.7,
  },
});
