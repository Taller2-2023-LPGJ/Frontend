import React from 'react';
import { StyleSheet, Text, View } from "react-native";

function SearchUser() {
  return (
    <View
    style={styles.container}
    >
      <Text>User search</Text>
    </View>
  );
}

export default SearchUser;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
});