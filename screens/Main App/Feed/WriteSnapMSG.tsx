import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from 'react-native-paper';
import { Navigation } from '../../../types/types';
import { useNavigation } from '@react-navigation/native';

type Props = {
    navigation: Navigation;
  };

function WriteSnapMSG({ navigation }: Props) {
    const navigation2 = useNavigation();

    const [text, setText] = useState('');

    const handleTextChange = (newText: any) => {
        setText(newText);
    };

    const handleSendSnapMSG = () => {
        if (remainingCharacters == 250){
            alert("You can't send an empty SnapMSG")
        } else {
            remainingCharacters < 0 
            ? alert("You have exceeded the character limit.")
            : 
                Alert.alert(
                    "Send SnapMSG",
                    "Do you want to proceed?",
                    [
                      {text: 'Cancel'},
                      {text: 'Yes',
                        onPress: () => {
                          console.log('Sent SnapMSG');
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
            <Text style={styles.topText}> Write your SnapMSG...
            </Text>
            
            <TextInput
                placeholder="Type something here"
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

export default WriteSnapMSG;

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