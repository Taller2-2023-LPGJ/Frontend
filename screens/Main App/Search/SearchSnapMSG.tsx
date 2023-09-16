import React from 'react';
import { StyleSheet, Text, View } from "react-native";

function SearchSnapMSG() {
  return (
    <View
    style={styles.container}
    >
      <Text>SnapMSG search</Text>
    </View>
  );
}

export default SearchSnapMSG;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
});