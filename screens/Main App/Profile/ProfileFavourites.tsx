import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate from '../Feed/FeedTemplate';
import { Navigation } from '../../../types/types';

type Props = {
  navigation: Navigation;
};

function ProfileFavourites({ navigation }: Props) {
  return (
    <View>
      <FeedTemplate navigation={navigation} feedType="FavFeed"></FeedTemplate>
    </View>
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