import { ScrollView, Image, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity, Alert, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Navigation } from "../../../types/types";
import { ActivityIndicator, Button } from "react-native-paper";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = API_URL;
const fetchAmount = 20;

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



const { height } = Dimensions.get("window");

export const SnapMSG: React.FC<{ snapMSGInfo: SnapMSGInfo, navigation: Navigation, scale: number, disabled: boolean }> = ({ snapMSGInfo,navigation, scale, disabled }) => {
    
    const [isLiked, setisLiked] = useState(snapMSGInfo.liked);
    const [isShared, setisShared] = useState(snapMSGInfo.shared);
    const [isFavourite, setisFavourite] = useState(snapMSGInfo.fav);

    const likePost = async () => {
      let id = snapMSGInfo.id
      try {
        if (isLiked) {
          await axios.delete(`${apiUrl}/content/like/${id}`);
          setisLiked(false)
        } else {
          await axios.post(`${apiUrl}/content/like/${id}`);
          setisLiked(true)
        }
      } catch (e) {
        const { onLogout } = useAuth();
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }
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
            onPress: async () => {
              let id = snapMSGInfo.id
              try {
                if (isShared) {
                  await axios.delete(`${apiUrl}/content/share/${id}`);
                  setisShared(false)
                } else {
                  await axios.post(`${apiUrl}/content/share/${id}`);
                  setisShared(true)
                }
              } catch (e) {
                const { onLogout } = useAuth();
                if ((e as any).response.status == "401") {
                  onLogout!();
                  alert((e as any).response.data.message);
                } else {
                  alert((e as any).response.data.message);
                }
              }
            },
          },
        ]
      );
    }

    const replyToPost = () => {
      navigation.navigate("ReplySnapMSG", {replyParams: {id:snapMSGInfo.id}})
    }
    
    const favouritePost = async () => {
      let id = snapMSGInfo.id
      try {
        if (isFavourite) {
          await axios.delete(`${apiUrl}/content/fav/${id}`);
          setisFavourite(false)
        } else {
          await axios.post(`${apiUrl}/content/fav/${id}`);
          setisFavourite(true)
        }
      } catch (e) {
        const { onLogout } = useAuth();
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }
    }

    const openSnapMSG = async () => {
      navigation.navigate("Feed2")
      navigation.navigate("SnapMSGDetails", {SnapMSGInfo: snapMSGInfo})
    }

    const openProfile = async () => {
      let result = await AsyncStorage.getItem("username");
      if (snapMSGInfo.author == result) {
        navigation.navigate("Profile")
      } else {
        navigation.navigate("Search")
        navigation.navigate("Search", {screen: "OtherProfile", params: {username: snapMSGInfo.author}})
      }
    }

    function timeAgo(dateString: string) {
      var time = new Date().getTime() - new Date(dateString).getTime();
      const seconds = Math.floor(time / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
    
      if (days > 0) {
        return `${days}d`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return `${seconds}s`;
      }
    }
    

    return (
        <>
        <TouchableOpacity style={styles.snapMSGContainer} onPress={openSnapMSG} disabled={disabled}>
        {snapMSGInfo.sharedBy != null ? (
          <View style={{flexDirection: 'row', marginBottom:10}}>
            <Icon size={(20*scale)} name={"repeat-variant"} color={textLight}/>
            <Text style={{fontSize:(15*scale), color:textLight}} >SnapShared by </Text>
            <Text style={{fontWeight: "bold", fontSize:(15*scale), color:textLight}}>{snapMSGInfo.sharedBy}</Text>
          </View>
        ) : null}
        {(snapMSGInfo.parentId != 0) && (snapMSGInfo.parentId != null) ? (
          <View style={{flexDirection: 'row', marginBottom:10}}>
            <Icon size={(20*scale)} name={"message-reply-outline"} color={textLight}/>
            <Text style={{fontSize:(15*scale),marginHorizontal:5, color:textLight}} >Reply</Text>
          </View>
        ) : null}
            <View style={styles.row}>
                <View style={{flexDirection: 'row', width: 200}}>
                  <TouchableOpacity onPress={openProfile}>
                      <Image
                          source={{
                          uri: snapMSGInfo.picture,
                          }}
                          style={{width: (45*scale),height: (45*scale),borderRadius:75}}
                      />
                    </TouchableOpacity>
                    <Text style={{marginLeft:5, fontSize:(15*scale),color:textLight, fontWeight: "bold"}}>{snapMSGInfo.displayName}</Text>
                    {snapMSGInfo.verified ? <Icon size={(15*scale)} color={textLight} style={{marginTop:5, marginLeft:5}} name="check-decagram" /> : null}
                    <Text style={{marginLeft:5, fontSize:(15*scale),color:textLight}}>@{snapMSGInfo.author}</Text>
                    {snapMSGInfo.editingDate ? <Icon size={(15*scale)} color={textLight} style={{marginTop:3, marginLeft:5}} name="pencil-outline" /> : null}
                </View>
                <Text style={{flex: 1,color:textLight, textAlign: 'right', fontSize:(15*scale)}}>{timeAgo(snapMSGInfo.creationDate)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={{flex: 1, fontSize:(15*scale),color:textLight}}>{snapMSGInfo.body}</Text>
            </View>

            <View style={[styles.row, styles.centeredRow]}>

              <View style={styles.statIcons}>
                <Icon size={(20*scale)} color={isLiked? accent : textLight} name={isLiked? "heart":"heart-outline"} onPress={likePost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale),color:textLight}}>{snapMSGInfo.likes}</Text>
              </View>    
                        
              <View style={styles.statIcons}>
                  <Icon size={(20*scale)} color={isShared? "#41628a" : textLight} name={"repeat-variant"} onPress={sharePost}/>
                  <Text style={{marginHorizontal:3, fontSize:(15*scale),color:textLight}}>{snapMSGInfo.shares}</Text>
              </View>
                        
              <View style={styles.statIcons}>
                <Icon size={(20*scale)} name={"message-outline"} color={textLight} onPress={replyToPost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale),color:textLight}}>{snapMSGInfo.replies}</Text>
              </View>

              <View style={styles.statIcons}>
                <Icon size={(20*scale)} color={isFavourite? "#6f7236" : textLight} name={isFavourite? "star":"star-outline"} onPress={favouritePost}/> 
              </View>
            </View>
        </TouchableOpacity>
        <View style={styles.separatorBar}></View>
        </>
    )
}

type Props = {
  navigation: Navigation;
  feedType: string;
  feedParams: {
    username: string,
    id: number
  };
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const FeedTemplate = ({ navigation, feedType, feedParams }: Props) => {

  const { onLogout } = useAuth();
  const [posts, setPosts] = useState<SnapMSGInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [endOfFeed, setEndOfFeed] = useState(false);

  const addPost = async () => {
    await sleep(100);
    try {
      let request = ""
      let username = feedParams.username
      let id = feedParams.id
      switch (feedType){
        case "GeneralFeed":
          request = `${apiUrl}/content/post?page=`
          break
        case "ProfileFeed":
          request = `${apiUrl}/content/post?author=${username}&page=`
          break
        case "FavFeed":
          request = `${apiUrl}/content/fav?page=`
          break
        case "ReplyFeed":
          request = `${apiUrl}/content/post/${id}?page=`
          break
        default:
          return
      }
      const response = await axios.get(request+currentPage.toString());
      if (response.data.message != null || response.data.length == 0) {
        setEndOfFeed(true)
      } else {
        const dataArray = response.data.map((item: { author: any; body: any; creationDate: any; displayName: any; editingDate: any; fav: any; id: any;liked:any;likes:any;parentId:any;sharedAt:any;sharedBy:any; tags: any; shares: any; shared: any, private: any, picture: any, replies: any, verified: any }) => ({
          author: item.author,
          body: item.body,
          creationDate: item.creationDate,
          displayName: item.displayName,
          editingDate: item.editingDate,
          id: item.id,
          tags: item.tags,
          fav: item.fav,
          liked: item.liked,
          likes: item.likes,
          parentId: item.parentId,
          sharedAt: item.sharedAt,
          sharedBy: item.sharedBy,
          shares: item.shares,
          shared: item.shared,
          privacy: item.private,
          picture: item.picture,
          replies: item.replies,
          verified: item.verified,
        }));
        
        if (currentPage == 0) {
          setPosts(dataArray)
        } else {
          setPosts([...posts.concat(dataArray)]);
        }
        if (dataArray.length < fetchAmount) {
          setEndOfFeed(true)
        }
        
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

  const handleScroll = (event: { nativeEvent: { layoutMeasurement: any; contentOffset: any; contentSize: any; }; }) => {
    if (!endOfFeed){
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const isAtEnd = (layoutMeasurement.height + contentOffset.y)*1.05 >= contentSize.height;
      if (isAtEnd) {
        setCurrentPage(currentPage + 1)
      }
    }
  };

  useEffect(() => {
    addPost(); 
  }, [currentPage]);

  const handleReloadFeed = () => {
    setPosts([])
    if (endOfFeed) {
      setEndOfFeed(false)
    }
    if (currentPage != 0) {
      setCurrentPage(0)
    } else {
      addPost()
    }
    
  }

  return (
      <ScrollView contentContainerStyle={styles.containerContent} style={styles.container} nestedScrollEnabled={true} onScrollEndDrag={handleScroll}>
        <Icon size={35} name={"reload"} color={textLight} style={{margin:15}} onPress={handleReloadFeed}/>
        {posts.map((post, index) => (
        <SnapMSG key={index} snapMSGInfo={post} navigation={navigation} scale={1} disabled={false}/>
        ))}
        <View
          style={{ justifyContent: "center", marginVertical: height / 12 }}>
            {endOfFeed ? (
              <Text style={{marginHorizontal:40, color:textLight}}>
                No more SnapMSGs to show
              </Text>
            ) : (
              <ActivityIndicator size="large" animating={true} />
            )}
        </View>
      </ScrollView>
    
  );
};

export default FeedTemplate;

import { accent, primaryColor, secondaryColor, textLight } from "../../../components/colors";
import { useAuth } from "../../../context/AuthContext";

const styles = StyleSheet.create({
  containerContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor:secondaryColor,
  },
  separatorBar: {
    width: "100%",
    backgroundColor: primaryColor,
    height: 1.5,
  },
  container: {
    width: "100%",
  },
  snapMSGContainer: {
    width: "100%",
    paddingHorizontal: 16, 
    paddingTop: 10,
    backgroundColor:secondaryColor
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