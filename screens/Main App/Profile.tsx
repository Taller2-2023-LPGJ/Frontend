import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();

  React.useEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
