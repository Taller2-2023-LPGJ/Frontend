import { Dimensions, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Navigation } from "../../types/types";
import { Button, Chip, Text } from "react-native-paper";

type Props = {
  navigation: Navigation;
};

const categories = ["Politics", "Technology", "Music", "Travel", "Business"];

const Interests = ({ navigation }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSelect = (val: string) => {
    setSelectedCategories((prev: string[]) =>
      prev.find((p) => p === val)
        ? prev.filter((cat) => cat !== val)
        : [...prev, val]
    );
  };

  function handleContinue() {
    if (selectedCategories.length === 0) {
      alert("You must select at least 1 interest");
    } else {
      console.log("Selected categories: ", selectedCategories);
      navigation.navigate("TabNavigator");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text} variant="headlineMedium">
        Choose your interests
      </Text>
      <View style={styles.chipsContainer}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            mode="outlined"
            style={styles.chip}
            textStyle={{ fontWeight: "400", padding: 1 }}
            showSelectedOverlay
            selected={selectedCategories.find((c) => cat === c) ? true : false}
            onPress={() => handleSelect(cat)}
          >
            {cat}
          </Chip>
        ))}
      </View>
      <View style={{ flexDirection: "row-reverse" }}>
        <Button style={styles.button} mode="contained" onPress={handleContinue}>
          Continue
        </Button>
      </View>
    </View>
  );
};

export default Interests;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    justifyContent: "center",
  },
  text: {
    marginBottom: 15,
    fontSize: width * 0.08,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    marginBottom: width * 0.05,
  },
  chip: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  button: {
    width: width * 0.4,
  },
});
