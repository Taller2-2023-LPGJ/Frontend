import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FeedTemplate, { SnapMSG } from './FeedTemplate';
import { Navigation } from '../../../types/types';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { primaryColor, secondaryColor, textLight } from '../../../components/colors';
import { useAuth } from '../../../context/AuthContext';
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
  privacy: boolean;
  picture: string;
  replies: number;
  verified: boolean;
}

type SnapMSGDetailsRouteParams = {
  SnapMSGInfo: SnapMSGInfo;
}

const SnapMSGDetails = ({ navigation}: Props) => {
  const route = useRoute<RouteProp<Record<string, SnapMSGDetailsRouteParams>, string>>()
  const navigation2 = useNavigation()
  const [username, setUsername] = useState("")
  const [isReply, setIsReply] = useState(false)
  const [reply, setReply] = useState()
  if (route.params.SnapMSGInfo){
    const snapMSGInfo = route.params.SnapMSGInfo
    
    const deleteSnapMSG = async () => {
      try {
        let id = snapMSGInfo.id
        await axios.delete(`${apiUrl}/content/post/${id}`);
        navigation2.goBack()
      } catch (e) {
        const { onLogout } = useAuth();
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
        navigation2.goBack()
      }
    }

    const editSnapMSG = () => {
      navigation.navigate("EditSnapMSG", {editParams: {body:snapMSGInfo.body, id:snapMSGInfo.id, privacy:snapMSGInfo.privacy}})
    }

    const getData = async () => {
      let result = await AsyncStorage.getItem("username");
      if (!result) {
        alert("User not found");
        return;
      } else {
        setUsername(result)
      }
      if (snapMSGInfo.parentId != 0) {
        setIsReply(true)
        let result = await axios.get(`${apiUrl}/content/post?id=${snapMSGInfo.parentId}`)
        setReply(result.data)
      }
    }

    useEffect(() => {
      getData();
    }, []);

    return (
      <View style={{backgroundColor: secondaryColor, flex:1}}>
          <View>
            <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1.3} disabled={true}></SnapMSG>
            
            {(username == snapMSGInfo.author)? (
              <View style={styles.snapMSGToolsContainer}>
                <Icon size={35} color={textLight} name={"poll"} style={styles.snapMSGTool}/>
                <Icon size={35} color={textLight} name={snapMSGInfo.privacy? "lock-outline" : "lock-open-variant-outline"} style={styles.snapMSGTool}/>
                <Icon size={35} color={textLight} name={"pencil-outline"} style={styles.snapMSGTool} onPress={editSnapMSG}/>
                <Icon size={35} color={textLight} name={"trash-can-outline"} style={styles.snapMSGTool} onPress={deleteSnapMSG}/>
              </View>
            ):(
              <View style={styles.snapMSGToolsContainer}>
                <Icon size={35} color={textLight} name={"poll"} style={styles.snapMSGTool}/>
              </View>
            )}
            
            <View style={styles.separatorBar}></View>
            <Text style={{fontSize:22, margin:5, color:textLight}}> Replies </Text>
          </View>
          <View style={{flex:1}}>
            {
            <FeedTemplate navigation={navigation} feedType="ReplyFeed" feedParams={{username:"",id:snapMSGInfo.id}}></FeedTemplate>
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
      marginVertical: 10,
    },
    snapMSGTool: {
      marginHorizontal: 10
    },
    separatorBar: {
      width: "100%",
      backgroundColor: primaryColor,
      height: 2,
    },
    
  });