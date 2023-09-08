import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { Navigation } from "../../navigation/types";
import Logo from "../../components/Logo";

type Props = {
  navigation: Navigation;
};

const { width } = Dimensions.get("window");

const StartScreen = ({ navigation }: Props) => {

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text}>
        SnapMsg
      </Text>

      <View>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>

        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 8,
    width: width*0.65,
  },
  text: {
    marginBottom: 40,
    fontSize:width*0.05
  },
});
