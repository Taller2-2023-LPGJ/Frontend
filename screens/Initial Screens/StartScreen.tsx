import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import React from "react";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { Navigation } from "../../types/types";
import Logo from "../../components/Logo";



type Props = {
  navigation: Navigation;
};

const { width } = Dimensions.get("window");

const StartScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        
        <Logo />
        

        <Text style={styles.text}>
          See what's happening in the world right now.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
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
    margin: 10,
    width: width * 0.8,
    borderRadius: 0,
  },
  text: {
    fontSize: width * 0.065,
    marginTop: 0,
  },
  buttonContainer: {
    marginTop: 60,
    flexDirection: "column",
  },
  topContainer: {
    flex: 9 / 10,
    alignItems: "center",
    padding: 10,
  },
  subtitle: {
    fontSize: width * 0.04,
    marginTop: 0,
  },
});
