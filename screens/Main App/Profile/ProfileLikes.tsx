import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";

function ProfileLikes() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Profile Likes</Text>
    </ScrollView>
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