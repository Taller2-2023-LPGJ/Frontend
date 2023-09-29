import { ScrollView, Image, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SnapMSG = () => {

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
      console.log("Opened SnapMSG")
    }

    const openProfile = () => {
      console.log("Opened profile")
    }

    return (
        <>
        <TouchableOpacity style={styles.snapMSGContainer} onPress={openSnapMSG}>
            <View style={styles.row}>
                <View style={{flexDirection: 'row', width: 200}}>
                  <TouchableOpacity onPress={openProfile}>
                      <Image
                          source={{
                          uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                          }}
                          style={styles.profileImage}
                      />
                    </TouchableOpacity>
                    <Text style={{marginLeft:10, fontSize:15, fontWeight: "bold"}}>DisplayName</Text>
                    <Text style={{marginLeft:5, fontSize:15}}>@username</Text>
                </View>
                <Text style={styles.date}>Date</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.snapMSGText}>SnapMSG Text</Text>
            </View>

            <View style={[styles.row, styles.centeredRow]}>
                <Icon size={20} color={isLiked? "red" : "black"} name={isLiked? "heart":"heart-outline"} onPress={likePost}/>
                <Text style={{marginHorizontal:3}}>0</Text>
                
                
                <View style={{width:"50%", flexDirection: 'row', justifyContent:"center"}}>
                    <Icon size={20} color={isShared? "blue" : "black"} name={"repeat-variant"} onPress={sharePost}/>
                    <Text style={{marginHorizontal:3}}>0</Text>
                </View>

                <Icon size={20} name={"message-outline"} onPress={replyToPost}/>
                <Text style={{marginHorizontal:3}}>0</Text>
            </View>
        </TouchableOpacity>
        <View style={styles.separatorBar}></View>
        </>
    )
}


const FeedTemplate = () => {
  const navigation = useNavigation();

  React.useEffect(() =>
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );

  return (
    <ScrollView contentContainerStyle={styles.containerContent} style={styles.container} nestedScrollEnabled={true}>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
        <SnapMSG></SnapMSG>
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
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 75,
  },
  container: {
    width: "100%",
  },
  snapMSGContainer: {
    width: "100%",
    paddingHorizontal: 16, // Padding around the content
    paddingTop: 10
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
  },
  snapMSGText: {
    flex: 1, // Expand to take available space
  },
  date: {
    flex: 1, // Expand to take available space
    textAlign: 'right', // Align text to the right
  },
  centeredRow: {
    justifyContent: 'center', // Center items in the row
  },
  centeredText: {
    textAlign: 'center', // Center text within the row
  },
});