import React from 'react';
import { StyleSheet, Text, View } from "react-native";

function ProfileSnapMSGs() {
  return (
    <View
    style={styles.container}
    >
      <Text>Profile SnapMSGs</Text>
    </View>
  );
}

export default ProfileSnapMSGs;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });