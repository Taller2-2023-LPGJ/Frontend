import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Feed from "./Feed";
import SnapMSGDetails from "./SnapMSGDetails";
import FeedTemplate from "./FeedTemplate";
import WriteSnapMSG from "./WriteSnapMSG";
import { Navigation } from "../../../types/types";
import { Pressable, TouchableOpacity, View, Image } from "react-native";
import Icon from "react-native-paper/lib/typescript/components/Icon";
import { Button } from "react-native-paper";
import { ParamListBase } from "@react-navigation/native";
import Settings from "../Settings/Settings";
import ProfileStackScreen from "../Profile/ProfileStackScreen";
import Profile from "../Profile/Profile";

const FeedStack = createNativeStackNavigator();

type CustomHeaderProps = {
  navigation: NativeStackNavigationProp<ParamListBase>; // Replace ParamListBase with your specific param list
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ navigation }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 20,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Profile9")}>
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
          }}
          style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 15 }}
        />
      </TouchableOpacity>
      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
        }}
        style={{ width: 50, height: 50 }}
      />

      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
        }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 15 }}
      />
    </View>
  );
};

const FeedStackScreen = () => {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        options={{ header: (props) => <CustomHeader {...props} /> }}
        name="Feed2"
        component={Feed}
      />
      <FeedStack.Screen
        options={{ title: "" }}
        name="SnapMSGDetails"
        component={SnapMSGDetails}
      />
      <FeedStack.Screen
        options={{ title: "" }}
        name="WriteSnapMSG"
        component={WriteSnapMSG}
      />
      <FeedStack.Screen
        options={{ title: "" }}
        name="Settings3"
        component={Settings}
      />
    </FeedStack.Navigator>
  );
};

export default FeedStackScreen;
