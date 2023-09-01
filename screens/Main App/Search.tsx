import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const navigation = useNavigation();

  React.useEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );
  return (
    <View style={styles.container}>
      <Text>Search</Text>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
