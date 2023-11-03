import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigation } from "../../../types/types";
import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDatabase,
  onChildAdded,
  onValue,
  push,
  ref,
  off,
  remove,
  serverTimestamp,
  set,
  update,
} from "firebase/database";

import { firebase, db } from "../../../components/config";

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

interface Message {
  id: string;
  text: string;
  isMyMessage: boolean;
}

type CustomHeaderProps = {
  username: string; // chattingWithUsername
  pp_url: string;
  navigation: Navigation;
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const default_pp_url =
  "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245";

const CustomHeader: React.FC<CustomHeaderProps> = ({
  username,
  pp_url,
  navigation,
}: CustomHeaderProps) => {
  const handleExitChat = async () => {
    const loggedInUserUsername = await AsyncStorage.getItem("username");
    const chatRef = ref(db, "chats/" + loggedInUserUsername + "/" + username);
    off(chatRef);
    navigation.navigate("Messages", {
      screen: "Chats",
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 20,
        padding: 5,
        backgroundColor: background,
      }}
    >
      <IconButton icon="arrow-left" onPress={handleExitChat} />

      <Image
        source={{
          uri: pp_url,
        }}
        style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 0 }}
      />

      <Text style={{ marginLeft: 10, fontSize: 16 }}>@{username}</Text>
    </View>
  );
};

const ChatWindow = ({ navigation }: Props) => {
  const route = useRoute<RouteParams>();
  const data = route.params;
  const chattingWithUsername = data.username;

  const checkUserProfilePicture = async (username: string) => {
    const storageRef = firebase.storage().ref();
    const profilePictureRef = storageRef.child(`${username}/avatar`);

    try {
      const pp = await profilePictureRef.getDownloadURL();
      return pp;
    } catch (error) {
      // If the file doesn't exist, return the default URL
      return default_pp_url;
    }
  };
  const navigation2 = useNavigation();

  const HeaderSetup = async () => {
    const profile_pic = await checkUserProfilePicture(chattingWithUsername);

    navigation2.setOptions({
      tabBarVisible: false,
    });

    navigation2.setOptions({
      header: (props: React.JSX.IntrinsicAttributes & CustomHeaderProps) => (
        <CustomHeader
          username={chattingWithUsername}
          pp_url={profile_pic}
          navigation={navigation}
        />
      ),
    });
  };

  // Use useEffect to set the header options when the component mounts
  useEffect(() => {
    HeaderSetup();
  }, []);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    setInputText("");
    if (inputText.trim() === "") return;

    const text = inputText.trim();

    const loggedInUserUsername = await AsyncStorage.getItem("username");
    let receptor = chattingWithUsername;
    let sender = loggedInUserUsername;

    // Message ref for the receptors db
    const newMessageRef = push(ref(db, "chats/" + receptor + "/" + sender));

    // Message ref for the senders db
    const newMessageRef2 = push(ref(db, "chats/" + sender + "/" + receptor));

    // Set the message data in the receptors db
    // This includes the id for the senders message
    set(newMessageRef, {
      sender: sender,
      body: text,
      id: newMessageRef.toString().split("/")[
        newMessageRef.toString().split("/").length - 1
      ],
      status: "unread",
    });

    // Set the message data in the senders db
    // This includes the id for the receptors message
    set(newMessageRef2, {
      sender: sender,
      body: text,
      id: newMessageRef2.toString().split("/")[
        newMessageRef2.toString().split("/").length - 1
      ],
      status: "unread",
    });

    await sleep(3000);

    const receiverMsgStatus = ref(
      db,
      "chats/" +
        receptor +
        "/" +
        sender +
        "/" +
        newMessageRef.toString().split("/")[
          newMessageRef.toString().split("/").length - 1
        ]
    );

    onValue(receiverMsgStatus, async (snapshot) => {
      const data = snapshot.val();

      // unread message. Send notification
      if (data.status === "unread") {
        const pushData =
          "{ " + '"type": "message","goto":' + '"' + sender + '"} ';

        await axios.post(
          `https://app.nativenotify.com/api/indie/notification`,
          {
            subID: receptor,
            appId: "13586",
            appToken: "SKYebTHATCXWbZ1Tlwlwle",
            title: sender,
            message: text,
            pushData: pushData,
          }
        );
      } else {
      }
    });
  };

  const startRealtimeListener = (loggedInUserUsername: string | null) => {
    const chatRef = ref(
      db,
      "chats/" + loggedInUserUsername + "/" + chattingWithUsername
    );

    //This callback will be triggered when a new chat message is added.
    onChildAdded(chatRef, (snapshot) => {
      const newChatMessage = snapshot.val();

      let isMine = false;
      if (newChatMessage.sender === loggedInUserUsername) {
        isMine = true;
      } else if (newChatMessage.status === "unread") {
        const updatedMessage = {
          sender: newChatMessage.sender,
          id: newChatMessage.id,
          body: newChatMessage.body,
          status: "read",
        };

        const updates: { [key: string]: any } = {};
        updates[
          "chats/" +
            loggedInUserUsername +
            "/" +
            newChatMessage.sender +
            "/" +
            newChatMessage.id
        ] = updatedMessage;
        update(ref(db), updates);
      }

      const newMessage: Message = {
        id: newChatMessage.id,
        text: newChatMessage.body,
        isMyMessage: isMine,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // const messageExists = messages.some(
      //   (message) => message.id === newMessage.id
      // );
      // if (!messageExists) {
      //   setMessages((prevMessages) => [...prevMessages, newMessage]);
      // }
    });
  };

  const handleEffect = async () => {
    const loggedInUserUsername = await AsyncStorage.getItem("username");
    startRealtimeListener(loggedInUserUsername);
  };

  useEffect(() => {
    handleEffect();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={
              item.isMyMessage
                ? styles.myMessageContainer
                : styles.otherMessageContainer
            }
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={(t) => setInputText(t)}
        />
        <IconButton
          icon="send"
          style={styles.sendButton}
          onPress={handleSend}
        />
      </View>
    </View>
  );
};

import { background } from "../../../components/colors";
import axios from "axios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: "darkblue",
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "darkgreen",
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  sendButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: background,
    marginLeft: 10,
  },
});

export default ChatWindow;
