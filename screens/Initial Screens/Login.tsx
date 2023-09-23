import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput, Text } from "react-native-paper";
import { Navigation } from "../../types/types";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: Navigation;
};

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

const Login = ({ navigation }: Props) => {
  const [identifier, setIdentifier] = React.useState("");
  const [pass, setPass] = React.useState("");
  const { onLogin } = useAuth();

  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "463820808275-497078tjprmogvgrjb35apbp172eemnu.apps.googleusercontent.com",
    webClientId:
      "463820808275-1e2fcu04hn09dvcn8aujhl1op5hlhbep.apps.googleusercontent.com",
  });

  const login = async () => {
    const result = await onLogin!(identifier, pass);

    if (result && result.error) {
      alert(result.message);
    } else {
      navigation.navigate("TabNavigator");
    }
  };

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success" && response.authentication) {
        // setToken(response.authentication.accessToken);
        console.log("getting user info");
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const handleRemove = async () => {
    await AsyncStorage.removeItem("@user");
    alert("removed local user info");
  };

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // handle error
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        Welcome!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email or Username"
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
        onPress={() => promptAsync()}
        icon="google"
      >
        Login with Google
      </Button>

      <Button
        style={{ width: width * 0.65, marginVertical: 10 }}
        mode="contained"
        onPress={() =>
          userInfo
            ? alert(`${(userInfo as any).email}, ${(userInfo as any).name}`)
            : alert("nada")
        }
      >
        Alert User Info test
      </Button>

      <Button
        style={{ width: width * 0.65, marginVertical: 10 }}
        mode="contained"
        onPress={() => handleRemove()}
      >
        Remove local store test
      </Button>

      <View style={{ flexDirection: "row", marginVertical: 20 }}>
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
