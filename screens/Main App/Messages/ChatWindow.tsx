import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { Navigation } from "../../../types/types";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onChildAdded, onValue, push, ref, set } from "firebase/database";
import { db } from "../../../components/config";

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const ChatWindow = ({ navigation }: Props) => {
  const route = useRoute<RouteParams>();
  const data = route.params;
  const chattingWithUsername = data.username;

  const startRealtimeListener = async () => {
    const loggedInUserUsername = await AsyncStorage.getItem("username");
    const chatRef = ref(
      db,
      "chats/" + loggedInUserUsername + "/" + chattingWithUsername
    );

    // This callback will be triggered when a new chat message is added.
    onChildAdded(chatRef, (snapshot) => {
      const newChatMessage = snapshot.val();

      ///////// Que devuelva solo el ultimo mensaje?
      console.log("New message received:", newChatMessage);
    });
  };

  const handleEffect = async () => {
    // Fetch chats and update chat window
    const loggedInUserUsername = await AsyncStorage.getItem("username");

    const starCountRef = ref(
      db,
      "chats/" + loggedInUserUsername + "/" + chattingWithUsername
    );
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  };

  useEffect(() => {
    handleEffect();
  }, []);

  // Listen to incoming messages from username
  startRealtimeListener();

  const handleSend = async () => {

    const loggedInUserUsername = await AsyncStorage.getItem("username");

    let receptor = chattingWithUsername
    let sender = loggedInUserUsername
    let body = "Hola"; // levantar del text input

    // Generate a unique key for the new message
    const newMessageRef = push(ref(db, "chats/" + receptor + "/" + sender));

    // Set the message data under the unique key
    set(newMessageRef, {
      sender: sender,
      body: body,
    });

    // Generate a unique key for the new message
    const newMessageRef2 = push(ref(db, "chats/" + sender + "/" + receptor));

    // Set the message data under the unique key
    set(newMessageRef2, {
      sender: sender,
      body: body,
    });
  };

  return (
    <View>
      <Text>Chat Screen with {chattingWithUsername}</Text>
    </View>
  );
};

export default ChatWindow;
