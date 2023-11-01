import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Navigation } from "../../../types/types";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDatabase,
  onChildAdded,
  onValue,
  push,
  ref,
  set,
} from "firebase/database";
import { db } from "../../../components/config";

import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";

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

const ChatWindow = ({ navigation }: Props) => {
  const route = useRoute<RouteParams>();
  const data = route.params;
  const chattingWithUsername = data.username;
  const [key, setKey] = useState("a");

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const text = inputText.trim();

    const loggedInUserUsername = await AsyncStorage.getItem("username");
    let receptor = chattingWithUsername;
    let sender = loggedInUserUsername;

    // Generate a unique key for the new message
    const newMessageRef = push(ref(db, "chats/" + receptor + "/" + sender));

    // Set the message data under the unique key
    set(newMessageRef, {
      sender: sender,
      body: text,
      id: newMessageRef.toString().split("/")[
        newMessageRef.toString().split("/").length - 1
      ],
    });

    // Generate a unique key for the new message
    const newMessageRef2 = push(ref(db, "chats/" + sender + "/" + receptor));

    // Set the message data under the unique key
    set(newMessageRef2, {
      sender: sender,
      body: text,
      id: newMessageRef2.toString().split("/")[
        newMessageRef2.toString().split("/").length - 1
      ],
    });

    setInputText("");
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
      }

      const newMessage: Message = {
        id: newChatMessage.id,
        text: newChatMessage.body,
        isMyMessage: isMine,
      };

      const messageExists = messages.some(
        (message) => message.id === newMessage.id
      );
      if (!messageExists) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
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
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={(t) => setInputText(t)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    backgroundColor: "darkred",
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
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "lightgray",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default ChatWindow;
