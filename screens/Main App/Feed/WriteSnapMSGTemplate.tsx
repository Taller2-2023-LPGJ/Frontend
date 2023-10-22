import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from 'react-native-paper';
import { Navigation } from '../../../types/types';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import { API_URL } from '@env';
const apiUrl = API_URL;


type Props = {
    navigation: Navigation;
    actionType: string;
    editParams: {
        id: number,
        body: string,
    };
    replyParams: {
        id: number,
    }
  };

const WriteSnapMSGTemplate = ({ navigation, actionType, editParams, replyParams}: Props) => {
    const navigation2 = useNavigation();
    const [text, setText] = useState(editParams.body);
    const [postPrivacy, setPostPrivacy] = useState(false);
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


    const handleChangePrivacy = () => {
      setPostPrivacy(!postPrivacy)
    }

    const handleTextChange = (newText: any) => {
        setText(newText);
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
                            console.log("Hola")
                            switch (actionType) {
                                case 'Edit':
                                    await axios.put(`${apiUrl}/content/post/`+editParams.id,{body,privacy,tags});
                                    navigation2.goBack()
                                    navigation2.goBack()
                                    break
                                case 'Write':
                                    await axios.post(`${apiUrl}/content/post`, {body, private: privacy, tags});
                                    navigation2.goBack()
                                    break
                                case 'Reply':
                                    //let id = editParams.id
                                    //await axios.post(`${apiUrl}/content/post/`+id, {body, private: privacy, tags});
                                    navigation2.goBack()
                                    break
                            }
                          } catch (e) {
                            alert((e as any).response.data.message);
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
            <Text style={styles.topText}> {title}</Text>
            <TextInput
                placeholder="Type something here..."
                onChangeText={handleTextChange}
                value={text}
                style={[
                    styles.textEntry,
                    remainingCharacters < 0
                        ? { backgroundColor: '#ffabab' }
                        : { backgroundColor: '#ededed' }
                ]}
                textAlignVertical="top" 
                multiline={true}
                numberOfLines={4}
            />
            <Text style={{fontSize:16}}>
                Characters remaining: {remainingCharacters} / 250
            </Text>
            <Icon size={(40)} name={postPrivacy? "lock-outline":"lock-open-variant-outline"} onPress={handleChangePrivacy} style={{margin:30}}/>
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              style={styles.writeSnapMSGButton}
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
    },
    feedContainer: {
        height: "85%",
        width: "100%",
        marginBottom: 10,
        alignItems: "center",
        backgroundColor: "#ccc",
    },
    writeSnapMSGButton: {
        marginBottom: 15,
        width: 170,
        height: 45,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        backgroundColor: "#ccc",
        width: "100%",
    },
    textEntry: {
        padding: 20,
        margin: 20,
        borderRadius: 25,
        height:"55%",
        width: "85%",
        fontSize: 18
    },
    topText: {
        alignSelf:"flex-start", 
        marginLeft: 30, 
        marginTop:30, 
        fontSize:20
    }
  });