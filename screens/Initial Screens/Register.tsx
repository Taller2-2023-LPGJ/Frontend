import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Button, TextInput, Text } from "react-native-paper";
import Logo from "../../components/Logo";
import { Navigation } from "../../navigation/types";

type Props = {
  navigation: Navigation;
};

const { width } = Dimensions.get("window");

const Register = ({ navigation }: Props) => {
  const [mail, setMail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [passConfirmation, setPassConfirmation] = React.useState("");

  function clearPasswordInputs() {
    setPass("");
    setPassConfirmation("");
  }

  function handleRegister() {
    if (
      mail === "" ||
      username === "" ||
      pass === "" ||
      passConfirmation === ""
    ) {
      alert("Empty input fields");
    } else {
      if (pass !== passConfirmation) {
        clearPasswordInputs();
        alert("Passwords don't match");
      } else {
        // sign up request
        console.log(`sign up request user: ${username}, mail: ${mail}, pass: ${pass}`);
        alert("Successful registration. Login.");
        navigation.navigate("Login");
      }
    }
  }

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
        onPress={() => handleRegister()}
      >
        Sign Up
      </Button>

      <View style={{ flexDirection: "row" }}>
        <Text>Already have an account?</Text>
        <Text
          style={{ fontStyle: "italic",fontWeight:"bold"  }}
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
