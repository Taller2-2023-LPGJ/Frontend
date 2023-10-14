import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";

function ProfileFavourites() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Profile Favourites</Text>
    </ScrollView>
  );
}

export default ProfileFavourites;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });