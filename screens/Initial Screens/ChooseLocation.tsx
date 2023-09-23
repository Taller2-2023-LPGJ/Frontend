import { Dimensions, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Navigation } from "../../types/types";
import { Button, Text, TextInput } from "react-native-paper";

type Props = {
  navigation: Navigation;
};

const ChooseLocation = ({ navigation }: Props) => {
  const [location, setLocation] = React.useState("");

  const handleGo = () => {
    if (location.length === 0) {
      console.log("blank location...");
    } else {
      // axios post setLocation...
      console.log(`set user location as ${location}`);
    }

    navigation.navigate("TabNavigator");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} variant="headlineMedium">
        Set your location
      </Text>
      <Text style={{ marginLeft: 3.5 }} variant="bodyMedium">
        Feel free to skip sharing your location if you'd like
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
