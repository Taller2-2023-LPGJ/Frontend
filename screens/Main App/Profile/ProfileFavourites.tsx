import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate from '../Feed/FeedTemplate';
import { Navigation } from '../../../types/types';
import { secondaryColor } from '../../../components/colors';

type Props = {
  navigation: Navigation;
};

function ProfileFavourites({ navigation }: Props) {
  return (
    <View style={{flexGrow:1, backgroundColor:secondaryColor}}>
      <FeedTemplate navigation={navigation} feedType="FavFeed" feedParams={{username:"", id:-1}}></FeedTemplate>
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