import React from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate, { SnapMSG } from './FeedTemplate';
import { Navigation } from '../../../types/types';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRoute } from '@react-navigation/native';

type Props = {
  navigation: Navigation;
};

function SnapMSGDetails({ navigation}: Props) {

  const snapMSGInfo = {
    displayName: "string",
    username: "string",
    timePosted: "string",
    content: "string",
    likeCount: 0,
    shareCount: 0,
    replyCount: 0
  }

  return (
     
    <View style={{backgroundColor: "#ccc", flex:1}}>
        <View>
          <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1.3} disabled={true}></SnapMSG>
          <View style={styles.snapMSGToolsContainer}>
            <Icon size={35} name={"poll"} style={styles.snapMSGTool}/>
            <Icon size={35} name={"lock-outline"} style={styles.snapMSGTool}/>
            <Icon size={35} name={"pencil-outline"} style={styles.snapMSGTool}/>
            <Icon size={35} name={"trash-can-outline"} style={styles.snapMSGTool}/>
          </View>
          <View style={styles.separatorBar}></View>
          <Text style={{fontSize:22, margin:5}}> Replies </Text>
        </View>
        <View style={{flex:1}}>
          <FeedTemplate navigation={navigation} feedType="ReplyFeed"></FeedTemplate>
        </View>
    </View>
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