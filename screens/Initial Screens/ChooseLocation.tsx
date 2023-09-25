import { Dimensions, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Navigation } from "../../types/types";
import { Button, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

type Props = {
  navigation: Navigation;
};

const ChooseLocation = ({ navigation }: Props) => {
  const [location, setLocation] = React.useState("");
  const { setLoggedIn } = useAuth();

  const handleGo = async () => {
    if (location.length === 0) {
      console.log("blank location...");
    } else {
      // axios update location...
      console.log(`set user location as ${location}`);
    }
    await setLoggedIn!();
    navigation.navigate("TabNavigator");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} variant="headlineMedium">
        Set your location
      </Text>
      <Text style={{ marginLeft: 0 }} variant="bodyMedium">
      If you'd rather keep your location private, feel free to leave this field blank. 
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Country, City..."
          value={location}
          mode="outlined"
          onChangeText={(location) => setLocation(location)}
        />
      </View>

      <View style={{ alignItems: "flex-end", marginVertical: 10 }}>
        <Button
          style={{ width: width * 0.2, marginVertical: 20 }}
          mode="contained"
          onPress={() => handleGo()}
        >
          Go
        </Button>
      </View>
    </View>
  );
};

export default ChooseLocation;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    justifyContent: "center",
  },
  text: {
    marginBottom: 5,
    fontSize: width * 0.08,
  },
  inputContainer: {
    marginVertical: 20,
    width: width * 0.85,
  },
});
