import { ScrollView, Image, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Navigation } from "../../../types/types";

interface SnapMSGInfo {
  displayName: string;
  username: string;
  timePosted: string;
  content: string;
}

type Props = {
  navigation: Navigation;
};

export const SnapMSG: React.FC<{ snapMSGInfo: SnapMSGInfo, navigation: Navigation, scale: number, disabled: boolean }> = ({ snapMSGInfo,navigation, scale, disabled }) => {

    const [isLiked, setisLiked] = useState(false);
    const [isShared, setisShared] = useState(false);

    const likePost = () => {
        console.log("Pressed like");
        isLiked ? setisLiked(false) : setisLiked(true); //prob esperar a tener confirmacion antes de actualizar el icono
    }

    const sharePost = () => {
      console.log("Pressed share");
      isShared ? setisShared(false) : setisShared(true);
    }

    const replyToPost = () => {
      console.log("Pressed reply");
    }

    const openSnapMSG = () => {
      navigation.navigate("SnapMSGDetails")
    }

    const openProfile = () => {
      console.log("Opened profile")
    }

    return (
        <>
        <TouchableOpacity style={styles.snapMSGContainer} onPress={openSnapMSG} disabled={disabled}>
            <View style={styles.row}>
                <View style={{flexDirection: 'row', width: 200}}>
                  <TouchableOpacity onPress={openProfile}>
                      <Image
                          source={{
                          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          }}
                          style={{width: (45*scale),height: (45*scale),borderRadius:75}}
                      />
                    </TouchableOpacity>
                    <Text style={{marginLeft:10, fontSize:(15*scale), fontWeight: "bold"}}>DisplayName</Text>
                    <Text style={{marginLeft:5, fontSize:(15*scale)}}>@username</Text>
                </View>
                <Text style={{flex: 1, textAlign: 'right', fontSize:(15*scale)}}>Date</Text>
            </View>

            <View style={styles.row}>
                <Text style={{flex: 1, fontSize:(15*scale)}}>SnapMSG Text</Text>
            </View>

            <View style={[styles.row, styles.centeredRow]}>
                <Icon size={(20*scale)} color={isLiked? "red" : "black"} name={isLiked? "heart":"heart-outline"} onPress={likePost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>0</Text>
                
                
                <View style={{width:"50%", flexDirection: 'row', justifyContent:"center"}}>
                    <Icon size={(20*scale)} color={isShared? "blue" : "black"} name={"repeat-variant"} onPress={sharePost}/>
                    <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>0</Text>
                </View>

                <Icon size={(20*scale)} name={"message-outline"} onPress={replyToPost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>0</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.separatorBar}></View>
        </>
    )
}


const FeedTemplate = ({ navigation }: Props) => {

  const snapMSGInfo = {
    displayName: "string",
    username: "string",
    timePosted: "string",
    content: "string",
  }

  return (
    <ScrollView contentContainerStyle={styles.containerContent} style={styles.container} nestedScrollEnabled={true}>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
        <SnapMSG snapMSGInfo={snapMSGInfo} navigation={navigation} scale={1} disabled={false}></SnapMSG>
    </ScrollView>
  );
};

export default FeedTemplate;

const styles = StyleSheet.create({
  containerContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  separatorBar: {
    width: "100%",
    backgroundColor: "white",
    height: 2,
  },
  container: {
    width: "100%",
  },
  snapMSGContainer: {
    width: "100%",
    paddingHorizontal: 16, 
    paddingTop: 10
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
  },
  centeredRow: {
    justifyContent: 'center', 
  },
  centeredText: {
    textAlign: 'center', 
  },
});