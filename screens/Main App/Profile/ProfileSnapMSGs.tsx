import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate from '../Feed/FeedTemplate';

function ProfileSnapMSGs() {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <FeedTemplate></FeedTemplate>
    </ScrollView>
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