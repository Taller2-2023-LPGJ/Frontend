import { Alert, Dimensions, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import React from "react";
import axios from "axios";
import { API_URL } from "@env";
import { Navigation } from "../../types/types";
import { useRoute } from "@react-navigation/native";
import Logo from "../../components/Logo";
import { background, primaryColor, textLight } from "../../components/colors";

const { width } = Dimensions.get("window");
const apiUrl = API_URL;

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const ChangePassword = ({ navigation }: Props) => {
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,32}$/;
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const hideLoadingIndicator = () => {
    setLoadingVisible(false);
  };
  const showLoadingIndicator = () => {
    setLoadingVisible(true);
  };

  const route = useRoute<RouteParams>();
  const data = route.params;
  const username = data.username;
  const code = data.code;

  const handleSend = async () => {
    if (!validInputs()) {
      return;
    }

    showLoadingIndicator();
    try {
      await axios.post(`${apiUrl}/users/setPassword`, {
        username,
        code,
        password,
      });

      hideLoadingIndicator();
      alert("Password changed");
      navigation.navigate("StartScreen");
    } catch (e) {
      hideLoadingIndicator();
      alert((e as any).response.data.message);
    }
  };

  const handleCancel = () => {
    navigation.navigate("StartScreen");
  };

  const validInputs = () => {
    if (password === "" || passwordConfirmation === "") {
      Alert.alert("Error", "Empty input fields.");
      return false;
    }

    if (password.length > 32 || password.length < 7) {
      Alert.alert("Error", "Password length must be between 7 and 32.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must contain at least 1 uppercase letter and one digit."
      );
      return false;
    }

    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords must match.");
      return false;
    }

    return true;
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
        Change Password
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="New password"
          secureTextEntry
          value={password}
          mode="outlined"
          style={{ marginBottom: 10 }}
          onChangeText={(password) => setPassword(password)}
        />

        <TextInput
          label="New password"
          secureTextEntry
          value={passwordConfirmation}
          mode="outlined"
          style={{ marginBottom: 10 }}
          onChangeText={(passwordConfirmation) =>
            setPasswordConfirmation(passwordConfirmation)
          }
        />
      </View>

      <Button
        style={styles.button}
        labelStyle={{color:textLight}}
        mode="contained"
        onPress={() => handleSend()}
      >
        Submit
      </Button>

      <Button
        style={styles.button}
        labelStyle={{color:textLight}}
        mode="contained"
        onPress={() => handleCancel()}
      >
        Cancel
      </Button>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:background
  },
  text: {
    marginBottom: 10,
    fontSize: width * 0.05,
  },
  inputContainer: {
    marginVertical: 10,
    width: width * 0.7,
  },
  button: {
    width: width*0.4,
    marginVertical: 10,
    backgroundColor:primaryColor
  }
});
