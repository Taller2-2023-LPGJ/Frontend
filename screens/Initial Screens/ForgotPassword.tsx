import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Navigation } from "../../types/types";
import { TextInput, Text, Button } from "react-native-paper";
import Logo from "../../components/Logo";
import { API_URL } from "@env";
import axios from "axios";

type Props = {
  navigation: Navigation;
};

const apiUrl = API_URL;
const { width } = Dimensions.get("window");

const ForgotPassword = ({ navigation }: Props) => {
  const [username, setUsername] = React.useState("");

  const handleForgotPassword = async () => {
    if (username === "") {
      alert("Empty input fields");
    } else {
      try {
        await axios.post(`${apiUrl}/users/recoverPassword`, {
          username,
        });
        navigation.navigate("PinConfirmation", {
          username: username,
          mode: "resetPass",
        });
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };

  return (
    <View style={styles.container}>
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
        style={{ width: width * 0.65, marginVertical: 10 }}
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
