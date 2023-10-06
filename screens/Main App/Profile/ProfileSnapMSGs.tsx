import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate from '../Feed/FeedTemplate';
import { Navigation } from '../../../types/types';

type Props = {
  navigation: Navigation;
};

function ProfileSnapMSGs({ navigation }: Props) {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <FeedTemplate navigation={navigation}></FeedTemplate>
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