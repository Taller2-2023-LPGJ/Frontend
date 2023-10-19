import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import {
  Button,
  TextInput,
  Text,
  ActivityIndicator,
  Modal,
  Portal,
} from "react-native-paper";
import Logo from "../../components/Logo";
import { Navigation } from "../../types/types";
import { useAuth } from "../../context/AuthContext";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type Props = {
  navigation: Navigation;
};

const GOOGLE_ERR_MSG = "Error fetching from Google. Please try again";
const USERS_SEARCH_URL =
  "https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/users/searchuser?user=";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,32}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,15}$/;

const Register = ({ navigation }: Props) => {
  const [mail, setMail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [passConfirmation, setPassConfirmation] = React.useState("");
  const { onRegister, setLogout, onRegisterGoogle } = useAuth();
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const hideLoadingIndicator = () => {
    setLoadingVisible(false);
  };
  const showLoadingIndicator = () => {
    setLoadingVisible(true);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "463820808275-tjqtu14eadrj8cvhig35seb0luvprp15.apps.googleusercontent.com",
    webClientId:
      "463820808275-1e2fcu04hn09dvcn8aujhl1op5hlhbep.apps.googleusercontent.com",
  });

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

  React.useEffect(() => {
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
    let name = null;
    if (userInfo) {
      email = (userInfo as any).email;
      name = (userInfo as any).name;
    } else {
      alert(GOOGLE_ERR_MSG);
      return;
    }
    let result = null;
    if (email && name) {
      showLoadingIndicator();
      result = await onRegisterGoogle!(name, email);
    } else {
      alert(GOOGLE_ERR_MSG);
      return;
    }

    if (result && result.error) {
      hideLoadingIndicator();
      alert(result.message);
    } else {
      storeUsername(email);
      hideLoadingIndicator();
      navigation.navigate("Interests", {
        username: email,
      });
    }
  }

  const validInputs = () => {
    if (
      mail === "" ||
      username === "" ||
      pass === "" ||
      passConfirmation === ""
    ) {
      Alert.alert("Error", "Empty input fields.");
      return false;
    }

    if (username.length > 15 || username.length < 4) {
      Alert.alert("Error", "Username length must be between 4 and 15.");
      return false;
    }

    if (!usernameRegex.test(username)) {
      Alert.alert(
        "Error",
        "Username can consist of only alphanumeric characters and underscores."
      );
      return false;
    }

    if (pass.length > 32 || pass.length < 7) {
      Alert.alert("Error", "Password length must be between 7 and 32.");
      return false;
    }

    if (!passwordRegex.test(pass)) {
      Alert.alert(
        "Error",
        "Password must contain at least 1 uppercase letter and one digit."
      );
      return false;
    }

    if (pass !== passConfirmation) {
      Alert.alert("Error", "Passwords must match.");
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validInputs()) {
      return;
    }

    showLoadingIndicator();
    const result = await onRegister!(username, mail, pass);

    if (result && result.error) {
      hideLoadingIndicator();
      alert(result.message);
    } else {
      await AsyncStorage.setItem("username", username);
      hideLoadingIndicator();
      navigation.navigate("PinConfirmation", {
        username: username,
        mode: "confirmReg",
      });
    }
    hideLoadingIndicator();
  };

  const handleGoogleRegister = async () => {
    await promptAsync();
  };

  const storeUsername = async (email: string) => {
    try {
      const response = await axios.get(`${USERS_SEARCH_URL}${email}`, {});
      const respUsername = response.data.name;
      console.log(`stored: ${respUsername}`);
      await AsyncStorage.setItem("username", respUsername);
    } catch (e) {
      //
    }
  };

  return (
    <View style={styles.container}>
      <Portal>
        <Modal
          visible={loadingVisible}
          dismissable={false}
          contentContainerStyle={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <ActivityIndicator
              animating={loadingVisible}
              size="large"
              color="#0000ff"
            />
          </View>
        </Modal>
      </Portal>
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        Create Account
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={mail}
          mode="outlined"
          onChangeText={(mail) => setMail(mail)}
        />

        <TextInput
          label="Username"
          value={username}
          mode="outlined"
          onChangeText={(username) => setUsername(username)}
        />

        <TextInput
          label="Password"
          secureTextEntry
          mode="outlined"
          value={pass}
          onChangeText={(pass) => setPass(pass)}
        />
        <TextInput
          label="Password confirmation"
          secureTextEntry
          mode="outlined"
          value={passConfirmation}
          onChangeText={(passConfirmation) =>
            setPassConfirmation(passConfirmation)
          }
        />
      </View>

      <Button
        style={{ width: width * 0.65, marginVertical: 20, borderRadius: 0 }}
        mode="contained"
        onPress={() => register()}
      >
        Sign Up
      </Button>

      <Button
        style={{ width: width * 0.65, marginVertical: 0, borderRadius: 0 }}
        mode="contained"
        onPress={() => {
          handleGoogleRegister();
        }}
        icon="google"
      >
        Sign up with Google
      </Button>

      <View style={{ flexDirection: "row", marginVertical: 25 }}>
        <Text>Already have an account?</Text>
        <Text
          style={{ fontStyle: "italic", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Login")}
        >
          {" "}
          Login
        </Text>
      </View>
    </View>
  );
};

export default Register;

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
