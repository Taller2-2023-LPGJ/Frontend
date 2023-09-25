import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput, Text } from "react-native-paper";
import { Navigation } from "../../types/types";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

type Props = {
  navigation: Navigation;
};

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

const Login = ({ navigation }: Props) => {
  const [identifier, setIdentifier] = React.useState("");
  const [pass, setPass] = React.useState("");
  const { onLogin, onLoginGoogle } = useAuth();

  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "463820808275-497078tjprmogvgrjb35apbp172eemnu.apps.googleusercontent.com",
    webClientId:
      "463820808275-1e2fcu04hn09dvcn8aujhl1op5hlhbep.apps.googleusercontent.com",
  });
  
  const login = async () => {


    if (
      identifier === "" ||
      pass === ""
    ) {
      Alert.alert("Error", "Empty input fields.");
      return false;
    }

    const result = await onLogin!(identifier, pass);

    if (result && result.error) {
      alert(result.message);
    } else {
      navigation.navigate("TabNavigator");
    }
  };

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    
  
    if (response?.type === "success" && response.authentication) {
      
      await getUserInfo(response.authentication.accessToken); /// ES ACA???!!!
    } else {
      return;
    }

  
    let email = null;
    if (userInfo) {
      
      email = (userInfo as any).email;
    } else {
      
      return;
    }
    let result = null;
    if (email) {
     
      result = await onLoginGoogle!((userInfo as any).email);
    } else {
      return;
    }

   
    if (result && result.error) {
      alert(result.message);
    } else {
      navigation.navigate("TabNavigator");
    }
  }

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
     
      //await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      

      // handle error
    }
  };

  const handleGoogleSignIn = async () => {
    await promptAsync();
  }

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
