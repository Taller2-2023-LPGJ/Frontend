import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate, { SnapMSG } from './FeedTemplate';
import { Navigation } from '../../../types/types';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
const apiUrl = API_URL;

type Props = {
  navigation: Navigation;
};

interface SnapMSGInfo {
  author: string;
  displayName: string;
  creationDate: string;
  body: string;
  editingDate: string;
  id: number;
  tags: string[];
  fav: boolean;
  liked: boolean;
  likes: number;
  parentId: number;
  sharedAt: string[];
  sharedBy: string[];
  shares: number;
  shared: boolean;
}

type SnapMSGDetailsRouteParams = {
  SnapMSGInfo: SnapMSGInfo;
}

const SnapMSGDetails = ({ navigation}: Props) => {

  const route = useRoute<RouteProp<Record<string, SnapMSGDetailsRouteParams>, string>>()
  const navigation2 = useNavigation()
  const [username, setUsername] = useState("")
  if (route.params.SnapMSGInfo){
    const snapMSGInfo = route.params.SnapMSGInfo

    const deleteSnapMSG = async () => {
      try {
        let id = snapMSGInfo.id
        await axios.delete(`${apiUrl}/content/post/${id}`);
        navigation2.goBack()
      } catch (e) {
        alert((e as any).response.data.message);
        navigation2.goBack()
      }
    }

    const editSnapMSG = () => {
      navigation.navigate("EditSnapMSG", {editParams: {body:snapMSGInfo.body, id:snapMSGInfo.id}})
    }

    const getData = async () => {
      let result = await AsyncStorage.getItem("username");
      if (!result) {
        alert("User not found");
        return;
      } else {
        setUsername(result)
      }
    }

    useEffect(() => {
      getData();
    }, []);
    
    return (
      <View style={{backgroundColor: "#ccc", flex:1}}>
          <View>
            <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1.3} disabled={true}></SnapMSG>
            
            {(username == snapMSGInfo.author)? (
              <View style={styles.snapMSGToolsContainer}>
                <Icon size={35} name={"poll"} style={styles.snapMSGTool}/>
                <Icon size={35} name={"lock-outline"} style={styles.snapMSGTool}/>
                <Icon size={35} name={"pencil-outline"} style={styles.snapMSGTool} onPress={editSnapMSG}/>
                <Icon size={35} name={"trash-can-outline"} style={styles.snapMSGTool} onPress={deleteSnapMSG}/>
              </View>
            ):(
              <View style={styles.snapMSGToolsContainer}>
                <Icon size={35} name={"poll"} style={styles.snapMSGTool}/>
              </View>
            )}
            
            <View style={styles.separatorBar}></View>
            <Text style={{fontSize:22, margin:5}}> Replies </Text>
          </View>
          <View style={{flex:1}}>
            {

            //<FeedTemplate navigation={navigation} feedType="ReplyFeed"></FeedTemplate>
            }
          </View>
      </View>
    );
  }
  
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