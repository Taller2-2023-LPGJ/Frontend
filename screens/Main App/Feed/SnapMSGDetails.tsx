import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate, { SnapMSG } from './FeedTemplate';
import { Navigation } from '../../../types/types';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';

type Props = {
  navigation: Navigation;
};

function SnapMSGDetails({ navigation }: Props) {


  const snapMSGInfo = {
    displayName: "string",
    username: "string",
    timePosted: "string",
    content: "string",
  }

  return (
    <ScrollView>
      <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1.3}></SnapMSG>
      <View style={styles.snapMSGToolsContainer}>
        <Icon size={35} name={"poll"} style={styles.snapMSGTool}/>
        <Icon size={35} name={"lock-outline"} style={styles.snapMSGTool}/>
        <Icon size={35} name={"pencil-outline"} style={styles.snapMSGTool}/>
        <Icon size={35} name={"trash-can-outline"} style={styles.snapMSGTool}/>
      </View>
      <View style={styles.separatorBar}></View>
      <Text style={{fontSize:22, margin:5}}> Replies </Text>
      <FeedTemplate navigation={navigation}></FeedTemplate>
    </ScrollView>
  );
}

export default SnapMSGDetails;

const styles = StyleSheet.create({
    snapMSGToolsContainer: {
      flexDirection: 'row', 
      justifyContent:"flex-end",
      marginVertical: 10
    },
    snapMSGTool: {
      marginHorizontal: 10
    },
    separatorBar: {
      width: "100%",
      backgroundColor: "white",
      height: 2,
    },
  });