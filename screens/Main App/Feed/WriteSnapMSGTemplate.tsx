import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from 'react-native-paper';
import { Navigation } from '../../../types/types';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import { API_URL } from '@env';
import { accent, background, primaryColor, secondaryColor, textLight } from '../../../components/colors';
import { useAuth } from '../../../context/AuthContext';
const apiUrl = API_URL;


type Props = {
    navigation: Navigation;
    actionType: string;
    editParams: {
        id: number,
        body: string,
        privacy: boolean,
    };
    replyParams: {
        id: number,
    }
  };

const WriteSnapMSGTemplate = ({ navigation, actionType, editParams, replyParams}: Props) => {
    const navigation2 = useNavigation();
    const [text, setText] = useState(editParams.body);
    const [postPrivacy, setPostPrivacy] = useState(editParams.privacy);
    const [followers, setFollowers] = useState<string[]>([])
    const [filteredFollowers, setFilteredFollowers] = useState(followers)
    const [openMentions, setOpenMentions] = useState(false)
    const [mentionSearch, setMentionSearch] = useState("")
    const { onLogout } = useAuth();

    let title = ""
    switch (actionType) {
        case "Write":
            title = "Write your SnapMSG..."
            break
        case "Edit":
            title = "Edit your SnapMSG..."
            break
        case "Reply":
            title = "Write your reply..."
            break
        default:
          return
      }

    const getFollowers = async () => {
      try {
        let api_result = await axios.get(`${API_URL}/content/follow/pablom/followers`);
        setFollowers(api_result.data.followers)
        setFilteredFollowers(followers)
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
      getFollowers()
    }, []);

    const handleChangePrivacy = () => {
      setPostPrivacy(!postPrivacy)
    }

    const handleTextChange = (newText: any) => {
      setText(newText);
    };

    const handleTagSearchChange = (newText: any) => {
      setMentionSearch(newText);
      let result = followers.filter(item => item.toLowerCase().includes(newText.toLowerCase()));
      setFilteredFollowers(result)
    };

    const handleChangeOpenTag = () => {
      setOpenMentions(!openMentions)
    }

    const handleAddMention = (mention: any) => {
      setText(text+"@"+mention)
      setOpenMentions(false)
    };


    const handleSendSnapMSG = () => {
        if (remainingCharacters == 250){
            alert("You can't send an empty SnapMSG")
        } else {
          let body = text
          let privacy = postPrivacy
          let tags = ["Business"]
            remainingCharacters < 0 
            ? alert("You have exceeded the character limit.")
            : 
                Alert.alert(
                    "Send SnapMSG",
                    "Do you want to proceed?",
                    [
                      {text: 'Cancel'},
                      {text: 'Yes',
                        onPress: async () => {
                          try {
                            switch (actionType) {
                                case 'Edit':
                                    await axios.put(`${apiUrl}/content/post/`+editParams.id,{body,private:privacy,tags});
                                    navigation2.goBack()
                                    navigation2.goBack()
                                    break
                                case 'Write':
                                    await axios.post(`${apiUrl}/content/post`, {body, private: privacy, tags});
                                    navigation2.goBack()
                                    break
                                case 'Reply':
                                    let id = replyParams.id
                                    await axios.post(`${apiUrl}/content/post/`+id, {body, private: privacy, tags});
                                    navigation2.goBack()
                                    break
                            }
                          } catch (e) {
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
    }

    const remainingCharacters = 250 - text.length;

    return (
        <View style={styles.container}>
          <View style={styles.feedContainer}>
           <View style={{flexDirection:"row"}}>
              <Text style={styles.topText}> {title}</Text>
              <Icon size={(25)} color={textLight} name={"at"} onPress={handleChangeOpenTag} style={{marginTop:30, marginLeft:70}}/>
            </View>
            {openMentions? 
              <View style={styles.tagEntryContainer}>
                <ScrollView contentContainerStyle={{width:"100%"}}>
                  <TextInput
                  placeholder="Tag user"
                  placeholderTextColor={textLight}
                  onChangeText={handleTagSearchChange}
                  value={mentionSearch}
                  style={[styles.tagEntry]}
                  />
                  {filteredFollowers.map((follower) => (
                    <TouchableOpacity style={styles.possibleTags} onPress={() => {
                      handleAddMention(follower)
                    }}>
                      <Text style={{fontSize:17, color:textLight}}>{follower} </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>  
              : null}
            <TextInput
                placeholder="Type something here..."
                placeholderTextColor={textLight}
                onChangeText={handleTextChange}
                value={text}
                style={[
                    styles.textEntry,
                    remainingCharacters < 0
                        ? { backgroundColor: '#613337' }
                        : { backgroundColor: primaryColor }
                ]}
                textAlignVertical="top" 
                multiline={true}
                numberOfLines={4}
            />
            <Text style={{fontSize:16, color:textLight}}>
                Characters remaining: {remainingCharacters} / 250
            </Text>
          </View>
          <View style={styles.buttonContainer}>
          <Icon size={(40)} color={textLight} name={postPrivacy? "lock-outline":"lock-open-variant-outline"} onPress={handleChangePrivacy} style={{marginBottom:15, marginRight:15}}/>
            <Button 
              style={styles.writeSnapMSGButton}
              labelStyle={{color:textLight}}
              mode="outlined"
              onPress={handleSendSnapMSG}
            >
              Send SnapMSG
            </Button>
          </View>
        </View>
      );
}

export default WriteSnapMSGTemplate;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:primaryColor
    },
    feedContainer: {
        height: "85%",
        width: "100%",
        marginBottom: 3,
        alignItems: "center",
        backgroundColor: secondaryColor,
    },
    writeSnapMSGButton: {
        marginBottom: 15,
        width: 170,
        height: 45,
        backgroundColor:primaryColor,
        borderWidth:0,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 10,
        backgroundColor: background,
        width: "100%",
    },
    tagEntryContainer: {
      backgroundColor: primaryColor,
      position: 'absolute',
      marginTop: 50,
      borderRadius: 10,
      height:"65%",
      width: "65%",
      zIndex:2,
      alignItems:"center",
      borderWidth:2,
      borderColor:background
    },
    tagEntry: {
      backgroundColor: background,
      padding:10,
      borderRadius: 25,
      height:40,
      width: 200,
      fontSize: 15,
      color:textLight,
      marginVertical:10,
    },
    textEntry: {
        padding: 20,
        margin: 20,
        borderRadius: 25,
        height:"55%",
        width: "85%",
        fontSize: 18,
        color:textLight
    },
    topText: {
        alignSelf:"flex-start", 
        marginLeft: 30, 
        marginTop:30, 
        fontSize:20,
        color:textLight
    },
    possibleTags: {
      backgroundColor:secondaryColor,
      padding: 8,
      marginVertical:5,
      borderRadius:7,
    }
  });