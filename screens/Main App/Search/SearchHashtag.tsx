import React from 'react';
import { StyleSheet, Text, View } from "react-native";

function SearchHashtag() {
  return (
    <View
    style={styles.container}
    >
      <Text>Hashtag search</Text>
    </View>
  );
}

export default SearchHashtag;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });