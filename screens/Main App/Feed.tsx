import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Feed = () => {
  const navigation = useNavigation();

  React.useEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );

  return (
    <View style={styles.container}>
      <Text>Feed</Text>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
