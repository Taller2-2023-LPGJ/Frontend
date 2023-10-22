import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate from '../Feed/FeedTemplate';
import { Navigation } from '../../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: Navigation;
};

const ProfileSnapMSGs = ({ navigation }: Props) => {
  const [username, setUsername] = useState("")
  const getData = async () => {
    let result = await AsyncStorage.getItem("username");
    if (result != null){
      setUsername(result)
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      {username != ""? <FeedTemplate navigation={navigation} feedType="ProfileFeed" feedParams={{username:username}}></FeedTemplate>:null}
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