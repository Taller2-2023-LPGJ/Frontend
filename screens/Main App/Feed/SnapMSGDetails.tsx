import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Share } from "react-native";
import FeedTemplate, { SnapMSG } from './FeedTemplate';
import { Navigation } from '../../../types/types';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { primaryColor, secondaryColor, textLight } from '../../../components/colors';
import { useAuth } from '../../../context/AuthContext';
import { ActivityIndicator } from "react-native-paper";



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
  id: number;
}

const SnapMSGDetails = ({ navigation}: Props) => {
  const route = useRoute<RouteProp<Record<string, SnapMSGDetailsRouteParams>, string>>()
  const navigation2 = useNavigation()
  const { onLogout } = useAuth();
  const [isReply, setIsReply] = useState(false)
  const [reply, setReply] = useState()
  const [username, setUsername] = useState("")

  let defaultInfo: SnapMSGInfo = {
    author: "",
    displayName: "",
    creationDate: "",
    body: "",
    editingDate: "",
    id: 0,
    tags: [],
    fav: false,
    liked: false,
    likes: 0,
    parentId: -1,
    sharedAt: [],
    sharedBy: [],
    shares: 0,
    shared: false,
    privacy: false,
    picture: "",
    replies: 0,
    verified: false,
  }
  let [snapMSGInfo, setSnapMSGInfo] = useState(defaultInfo)


  if (route.params.id){
    const getData = async () => {
      try {
        let api_result = await axios.get(`${API_URL}/content/post?id=${route.params.id.toString()}`);
        setSnapMSGInfo(api_result.data[0])
        let result = await AsyncStorage.getItem("username");
        if (!result) {
          alert("User not found");
          return;
        } else {
          setUsername(result)
        }
        if (api_result.data[0].parentId != 0) {
          setIsReply(true)
        }
      } catch (e) {
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }

      
    }

    useEffect(() => {
      getData();
    }, []);

    const deleteSnapMSG = async () => {
      try {
        let id = snapMSGInfo.id
        await axios.delete(`${apiUrl}/content/post/${id}`);
        navigation2.goBack()
      } catch (e) {
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

    const handleShare = async() => {
      let message = "@"+snapMSGInfo.author+" just posted this on SnapMSG: \n\n'" + snapMSGInfo.body + "'\n\nCheck out more on the SnapMSG app"
      const shareOptions = {
        message: message
      }

      try {
        const ShareResponse = await Share.share(shareOptions);
      } catch(e) {
        alert((e as any).response.data.message);
      }
    }

    return (
      <View style={{backgroundColor: secondaryColor, flex:1}}>
        {snapMSGInfo.parentId == -1 ? 
        <View style={{ justifyContent: "center", alignContent:"center", flex:1, marginVertical: 20 }}>
          <ActivityIndicator size="large" animating={true} />
        </View>
        :  
          (<><View>
            <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1.3} disabled={true}></SnapMSG>
            {(username == snapMSGInfo.author) ? (
              <View style={styles.snapMSGToolsContainer}>
                <Icon size={35} color={textLight} name={snapMSGInfo.privacy ? "lock-outline" : "lock-open-variant-outline"} style={styles.snapMSGTool} />
                <Icon size={35} color={textLight} name={"pencil-outline"} style={styles.snapMSGTool} onPress={editSnapMSG} />
                <Icon size={35} color={textLight} name={"trash-can-outline"} style={styles.snapMSGTool} onPress={deleteSnapMSG} />
                <Icon size={35} color={textLight} name={"share-outline"} style={styles.snapMSGTool} onPress={handleShare} />
              </View>
            ) : 
              <View style={styles.snapMSGToolsContainer}>
                <Icon size={35} color={textLight} name={"share-outline"} style={styles.snapMSGTool} onPress={handleShare} />
              </View>
            }

            <View style={styles.separatorBar}></View>
            <Text style={{ fontSize: 22, margin: 5, color: textLight }}> Replies </Text>
          </View><View style={{ flex: 1 }}>
              <FeedTemplate navigation={navigation} feedType="ReplyFeed" feedParams={{ username: "", id: route.params.id }}></FeedTemplate>
            </View></>)
        }
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