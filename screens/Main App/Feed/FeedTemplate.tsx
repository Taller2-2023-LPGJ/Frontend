import { ScrollView, Image, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Navigation } from "../../../types/types";
import { Button } from "react-native-paper";

interface SnapMSGInfo {
  displayName: string;
  username: string;
  timePosted: string;
  content: string;
  likeCount: number,
  shareCount: number,
  replyCount: number
}

type Props = {
  navigation: Navigation;
  feedType: string;
};

export const SnapMSG: React.FC<{ snapMSGInfo: SnapMSGInfo, navigation: Navigation, scale: number, disabled: boolean }> = ({ snapMSGInfo,navigation, scale, disabled }) => {

    const [isLiked, setisLiked] = useState(false);
    const [isShared, setisShared] = useState(false);
    const [isFavourite, setisFavourite] = useState(false);

    const likePost = () => {
        console.log("Pressed like");
        isLiked ? setisLiked(false) : setisLiked(true); //prob esperar a tener confirmacion antes de actualizar el icono
    }

    const sharePost = () => {
      let alertTitle = ""
      isShared ? alertTitle = "Undo Snapshare" : alertTitle = "Snapshare"
      Alert.alert(
        alertTitle,
        'Do you want to proceed?',
        [
          {text: 'Cancel'},
          {text: 'Yes',
            onPress: () => {
              isShared ? setisShared(false) : setisShared(true);
              console.log('Clicked snapshare button');
            },
          },
        ]
      );
    }

    const replyToPost = () => {
      console.log("Pressed reply");
    }
    
    const favouritePost = () => {
      setisFavourite(!isFavourite)
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

              <View style={styles.statIcons}>
                <Icon size={(20*scale)} color={isLiked? "red" : "black"} name={isLiked? "heart":"heart-outline"} onPress={likePost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>{snapMSGInfo.likeCount}</Text>
              </View>    
                        
              <View style={styles.statIcons}>
                  <Icon size={(20*scale)} color={isShared? "blue" : "black"} name={"repeat-variant"} onPress={sharePost}/>
                  <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>{snapMSGInfo.shareCount}</Text>
              </View>
                        
              <View style={styles.statIcons}>
                <Icon size={(20*scale)} name={"message-outline"} onPress={replyToPost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>{snapMSGInfo.replyCount}</Text>
              </View>

              <View style={styles.statIcons}>
                <Icon size={(20*scale)} color={isFavourite? "yellow" : "black"} name={isFavourite? "star":"star-outline"} onPress={favouritePost}/> 
              </View>
            </View>
        </TouchableOpacity>
        <View style={styles.separatorBar}></View>
        </>
    )
}


const FeedTemplate = ({ navigation, feedType }: Props) => {

  switch (feedType) {
    case "FavouriteFeed":
      break;
    case "ProfileFeed":
      break;
    case "GeneralFeed":
      break;
    case "ReplyFeed":
      break
    default:
      break;
  }

  const [posts, setPosts] = useState<SnapMSGInfo[]>([]);

  const addPost = () => { // Acá pegarle a la API
    const randnum = Math.floor(Math.random() * (50 + 1));
    const aux = {
      displayName: "string",
      username: "string",
      timePosted: "string",
      content: "string",
      likeCount: randnum,
      shareCount: randnum,
      replyCount: randnum
    }
    setPosts([...posts,aux,aux,aux,aux,aux, aux, aux,aux,aux]);
  }

  const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtEnd = (layoutMeasurement.height + contentOffset.y)*1.1 >= contentSize.height;
    if (isAtEnd) {
      addPost();
    }
  };

  useEffect(() => {
    addPost(); 
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.containerContent} style={styles.container} nestedScrollEnabled={true} onScrollEndDrag={handleScroll}>
        {posts.map((post, index) => (
        <SnapMSG key={index} snapMSGInfo={post} navigation={navigation} scale={1} disabled={false}/>
        ))}
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
  statIcons: {
    flexDirection: 'row', 
    justifyContent:"center",
    marginHorizontal:20
  }
});