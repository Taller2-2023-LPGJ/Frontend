import React from 'react';
import { StyleSheet, Text, View } from "react-native";

function ProfileLikes() {
  return (
    <View
    style={styles.container}
    >
      <Text>Profile Likes</Text>
    </View>
  );
}

export default ProfileLikes;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });