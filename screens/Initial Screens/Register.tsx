import { Alert, Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Button, TextInput, Text } from "react-native-paper";
import Logo from "../../components/Logo";
import { Navigation } from "../../types/types";
import { useAuth } from "../../context/AuthContext";

type Props = {
  navigation: Navigation;
};


const { width } = Dimensions.get("window");
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,32}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,15}$/;

const Register = ({ navigation }: Props) => {
  const [mail, setMail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [passConfirmation, setPassConfirmation] = React.useState("");

  const { onRegister, setLogout } = useAuth();

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

    const result = await onRegister!(username, mail, pass);

    if (result && result.error) {
      alert(result.message);

    } else {

      setLogout!();
      navigation.navigate("PinConfirmation", {
        username: "test",
        mode: "confirmReg",
      });

    }
  };

  return (
    <View style={styles.container}>
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
        style={{ width: width * 0.65, marginVertical: 20 }}
        mode="contained"
        onPress={() => register()}
      >
        Sign Up
      </Button>

      <View style={{ flexDirection: "row" }}>
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
