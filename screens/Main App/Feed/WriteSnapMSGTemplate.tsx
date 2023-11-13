import React, { FC, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button } from 'react-native-paper';
import { Navigation } from '../../../types/types';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import { API_URL } from '@env';
import { accent, background, primaryColor, secondaryColor, textLight } from '../../../components/colors';
import { useAuth } from '../../../context/AuthContext';
import { MentionInput, MentionSuggestionsProps, replaceMentionValues  } from 'react-native-controlled-mentions'
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    const [followers, setFollowers] = useState<{id:string,name:string}[]>([])
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
        let result = await AsyncStorage.getItem("username");
        if (result == null) {
          alert("User not found");
          return;
        } else {
          let api_result = await axios.get(`${API_URL}/content/follow/${result}/followers`);
          let parsed = api_result.data.followers.map((name: string, index: number) => ({
            id: (index + 1).toString(),
            name: name,
          }));
          setFollowers(parsed)
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
      getFollowers()
    }, []);

    const handleChangePrivacy = () => {
      setPostPrivacy(!postPrivacy)
    }

    const handleTextChange = (newText: any) => {
      setText(newText);
    };


    const handleAddMention = (mention: any) => {
      setText(text+mention+" ")
    };


    const handleSendSnapMSG = () => {
        if (remainingCharacters == 250){
            alert("You can't send an empty SnapMSG")
        } else {
          let body = replaceMentionValues(text, ({name}) => `@${name}`)
          let privacy = postPrivacy
          let tags: string[] = []
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
    
    const renderSuggestions: FC<MentionSuggestionsProps> = ({keyword, onSuggestionPress}) => {
      if (keyword == null) {
        return null;
      }
    
      return (
        <View style={{backgroundColor:primaryColor, borderRadius:5}}>
          {followers
            .filter(one => one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
            .map(one => (
              <Pressable
                key={one.id}
                onPress={() => onSuggestionPress(one)}
    
                style={{paddingHorizontal: 10, paddingVertical:2}}
              >
                <Text style={{color:textLight, backgroundColor:background, borderRadius:5, padding:5}}>{one.name}</Text>
              </Pressable>
            ))
          }
        </View>
      );
    };

    return (
        <View style={styles.container}>
          <View style={styles.feedContainer}>
           <View>
              <Text style={styles.topText}> {title}</Text>
            </View>
            <MentionInput
                placeholder="Type something here..."
                placeholderTextColor={textLight}
                onChange={handleTextChange}
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
                partTypes={[
                  {
                    trigger: '@',
                    renderSuggestions,
                    textStyle: {fontWeight: 'bold', color: accent},
                    isBottomMentionSuggestionsRender:true,
                  },
                ]}
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
    textEntry: {
        padding: 20,
        margin: 20,
        borderRadius: 25,
        height:"55%",
        width: 350,
        fontSize: 18,
        color:textLight
    },
    topText: {
        alignSelf:"center", 
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