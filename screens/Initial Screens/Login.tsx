import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Button, TextInput, Text } from "react-native-paper";
import { Navigation } from "../../navigation/types";
import Logo from "../../components/Logo";


type Props = {
  navigation: Navigation;
};

const { width } = Dimensions.get("window");

const Login = ({ navigation }: Props) => {

  function handleLogin() {
    if (mail === "" || pass === "") {
      alert("Empty input fields");
    } else {
      // login request
      console.log(`login request mail: ${mail} pass: ${pass}`);
      navigation.navigate("TabNavigator");
    }
  }

  const [mail, setMail] = React.useState("");
  const [pass, setPass] = React.useState("");


  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        Welcome!
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={mail}
          mode="outlined"
          style={{ marginBottom: 10 }}
          onChangeText={(mail) => setMail(mail)}
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
        style={{ marginLeft: width * 0.35 }}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        Forgot your password?
      </Text>

      <Button
        style={{ width: width * 0.65, marginVertical: 20 }}
        mode="contained"
        onPress={() => handleLogin()}
      >
        Login
      </Button>

      <View style={{ flexDirection: "row" }}>
        <Text>Don't have an account?</Text>
        <Text
          style={{ fontStyle: "italic" }}
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
    fontSize:width*0.05
  },
  inputContainer: {
    marginVertical: 10,
    width: width * 0.7,
  },
});
