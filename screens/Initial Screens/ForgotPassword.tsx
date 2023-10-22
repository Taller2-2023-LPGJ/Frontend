import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Navigation } from "../../types/types";
import {
  TextInput,
  Text,
  Button,
  Portal,
  Modal,
  ActivityIndicator,
} from "react-native-paper";
import Logo from "../../components/Logo";
import { API_URL } from "@env";
import axios from "axios";
import { background, primaryColor, textLight } from "../../components/colors";

type Props = {
  navigation: Navigation;
};

const apiUrl = API_URL;
const { width } = Dimensions.get("window");

const ForgotPassword = ({ navigation }: Props) => {
  const [username, setUsername] = React.useState("");
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const hideLoadingIndicator = () => {
    setLoadingVisible(false);
  };
  const showLoadingIndicator = () => {
    setLoadingVisible(true);
  };

  const handleForgotPassword = async () => {
    if (username === "") {
      alert("Empty input fields");
    } else {
      showLoadingIndicator();
      try {
        await axios.post(`${apiUrl}/users/recoverPassword`, {
          username,
        });
        hideLoadingIndicator()
        navigation.navigate("PinConfirmation", {
          username: username,
          mode: "resetPass",
        });
      } catch (e) {
        hideLoadingIndicator()
        alert((e as any).response.data.message);
      }
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
        Restore Password
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={username}
          mode="outlined"
          style={{ marginBottom: 10 }}
          onChangeText={(username) => setUsername(username)}
        />
      </View>

      <Button
        style={styles.button}
        labelStyle={{color:textLight}}
        mode="contained"
        onPress={() => handleForgotPassword()}
      >
        Send Instructions
      </Button>
    </View>
  );
};

export default ForgotPassword;

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
