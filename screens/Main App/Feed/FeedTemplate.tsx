import { ScrollView, Image, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity, Alert, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Navigation } from "../../../types/types";
import { ActivityIndicator, Button } from "react-native-paper";
import axios from "axios";
import { API_URL } from "@env";
const apiUrl = API_URL;

interface SnapMSGInfo {
  author: string;
  displayName: string;
  creationDate: string;
  body: string;
  editingDate: string;
  id: number;
  tags: string[];
}

type Props = {
  navigation: Navigation;
  feedType: string;
};



const { height } = Dimensions.get("window");

export const SnapMSG: React.FC<{ snapMSGInfo: SnapMSGInfo, navigation: Navigation, scale: number, disabled: boolean }> = ({ snapMSGInfo,navigation, scale, disabled }) => {

    const [isLiked, setisLiked] = useState(false);
    const [isShared, setisShared] = useState(false);
    const [isFavourite, setisFavourite] = useState(false);

    const likePost = async () => {
      let id = snapMSGInfo.id
      try {
        if (isLiked) {
          const response = await axios.delete(`${apiUrl}/content/like/${id}}`);
          setisLiked(false)
        } else {
          const response = await axios.post(`${apiUrl}/content/like/${id}}`);
          setisLiked(true)
        }
      } catch (e) {
        alert((e as any).response.data.message);
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
    
    const favouritePost = async () => {
      let id = snapMSGInfo.id
      try {
        if (isFavourite) {
          const response = await axios.delete(`${apiUrl}/content/fav/${id}}`);
          setisFavourite(false)
        } else {
          const response = await axios.post(`${apiUrl}/content/fav/${id}}`);
          setisFavourite(true)
        }
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }

    const openSnapMSG = () => {
      navigation.navigate("SnapMSGDetails", {SnapMSGInfo: snapMSGInfo})
    }

    const openProfile = () => {
      console.log("Opened profile")
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
                    <Text style={{marginLeft:10, fontSize:(15*scale), fontWeight: "bold"}}>{snapMSGInfo.displayName}</Text>
                    <Text style={{marginLeft:5, fontSize:(15*scale)}}>@{snapMSGInfo.author}</Text>
                </View>
                <Text style={{flex: 1, textAlign: 'right', fontSize:(15*scale)}}>{timeAgo(snapMSGInfo.creationDate)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={{flex: 1, fontSize:(15*scale)}}>{snapMSGInfo.body}</Text>
            </View>

            <View style={[styles.row, styles.centeredRow]}>

              <View style={styles.statIcons}>
                <Icon size={(20*scale)} color={isLiked? "red" : "black"} name={isLiked? "heart":"heart-outline"} onPress={likePost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>{1}</Text>
              </View>    
                        
              <View style={styles.statIcons}>
                  <Icon size={(20*scale)} color={isShared? "blue" : "black"} name={"repeat-variant"} onPress={sharePost}/>
                  <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>{1}</Text>
              </View>
                        
              <View style={styles.statIcons}>
                <Icon size={(20*scale)} name={"message-outline"} onPress={replyToPost}/>
                <Text style={{marginHorizontal:3, fontSize:(15*scale)}}>{1}</Text>
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
      
    case "ProfileFeed":
      
    case "GeneralFeed":
      
    case "ReplyFeed":
    default:
      
  }

  const [posts, setPosts] = useState<SnapMSGInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [endOfFeed, setEndOfFeed] = useState(false);

  const addPost = async () => {
    try {
      const response = await axios.get(`${apiUrl}/content/post?page=`+currentPage.toString());
      if (response.data.message != null) {
        setEndOfFeed(true)
      } else {
        const dataArray = response.data.map((item: { author: any; body: any; creationDate: any; displayName: any; editingDate: any; id: any; tags: any; }) => ({
          author: item.author,
          body: item.body,
          creationDate: item.creationDate,
          displayName: item.displayName,
          editingDate: item.editingDate,
          id: item.id,
          tags: item.tags,
        }));
        setPosts([...posts.concat(dataArray)]);
      }
      
    } catch (e) {
      alert((e as any).response.data.message);
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
  }, []);

  useEffect(() => {
    addPost(); 
  }, [currentPage]);

  const handleReloadFeed = () => {
    setPosts([])
    setEndOfFeed(false)
    setCurrentPage(0)
  }

  return (
    <ScrollView contentContainerStyle={styles.containerContent} style={styles.container} nestedScrollEnabled={true} onScrollEndDrag={handleScroll}>
        <Icon size={35} name={"reload"} style={{margin:15}} onPress={handleReloadFeed}/>
        {posts.map((post, index) => (
        <SnapMSG key={index} snapMSGInfo={post} navigation={navigation} scale={1} disabled={false}/>
        ))}
        <View
          style={{ justifyContent: "center", marginVertical: height / 12 }}>
            {endOfFeed ? (
              <Text style={{marginHorizontal:40}}>
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