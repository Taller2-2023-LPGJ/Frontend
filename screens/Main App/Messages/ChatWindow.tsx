import { View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { Navigation } from "../../../types/types";
import { useRoute } from "@react-navigation/native";

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
  const username = data.username;

  return (
    <View>
      <Text>Chat with: {username}</Text>
    </View>
  );
};

export default ChatWindow;
