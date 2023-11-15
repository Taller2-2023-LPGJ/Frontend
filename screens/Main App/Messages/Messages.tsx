import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Modal,
  Text,
  TextInput,
} from "react-native-paper";
import React, { useEffect, useState } from "react";

import { firebase, db } from "../../../components/config";
import { onValue, push, ref, remove, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const default_pp_url =
  "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245";

const { width } = Dimensions.get("window");

const getUsername = async () => {
  return await AsyncStorage.getItem("username");
};

type ChatData = {
  sender: string;
  message: string;
};

type ChatCardInfo = {
  username: string;
  avatar: string;
};

type ChatListData = {
  username: string;
  chats: ChatData[];
};

type Props = {
  navigation: Navigation;
};

const ChatList = ({ navigation }: Props) => {
  const [activeChats, setActiveChats] = useState<ChatCardInfo[]>([]);

  const handleDeleteChat = async (chattingWithUsername: string) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const username = await getUsername();
            await remove(
              ref(db, "chats/" + username + "/" + chattingWithUsername)
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

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

  // Fetch active chats from the server
  const fetchActiveChats = async () => {
    setIsLoading(true);
    const username = await getUsername();

    const starCountRef = ref(db, "chats/" + username);
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data: ChatListData = snapshot.val();
        const usernames = Object.keys(data);
        const newActiveChats: ChatCardInfo[] = [];
        for (const username of usernames) {
          const avatar = await checkUserProfilePicture(username);
          newActiveChats.push({ username, avatar });
        }

        setActiveChats(newActiveChats);
        setIsLoading(false);
      } else {
        setActiveChats([]);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchActiveChats();
  }, []);

  const handleChatCardPress = (username: string) => {
    navigation.navigate("ChatWindow", {
      username: username,
    });
  };

  const renderItem = ({ item }: { item: ChatCardInfo }) => (
    <TouchableOpacity
      onPress={() => handleChatCardPress(item.username)}
      style={styles.card}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: item.avatar }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            marginRight: 18,
            marginVertical:7
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 24 }}>@{item.username}</Text>
          {/* <IconButton
            icon="trash-can"
            onPress={() => handleDeleteChat(item.username)}
          /> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActiveChats();
    setRefreshing(false);
  };

  return (
    <View style={{backgroundColor:secondaryColor}}>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "45%",
          }}
        >
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <View>
          {activeChats.length ? (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={activeChats}
              renderItem={renderItem}
            />
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.message}>Welcome to your inbox!</Text>
              <Text style={{ marginTop: 5 }}>
                New Messages Will Appear Here 📬
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// const FetchData = () => {
//   // get todos los chats para 'lucas'
//   const getData = async () => {
//     const username = await getUsername();
//     const starCountRef = ref(db, "chats/" + username);
//     onValue(starCountRef, (snapshot) => {
//       const data = snapshot.val();
//       //console.log(data);
//       // const newPosts = Object.keys(data).map((key) => ({
//       //   id: key,
//       //   ...data[key],
//       // }));

//       // console.log(newPosts);
//     });
//   };

//   // function to add data to firebase realtime db
//   const addDataOn = async () => {
//     let receptor = "lucas1234";
//     let username = "lucas123";
//     let body = "Hola que tal!";

//     const newMessageRef = push(ref(db, "chats/" + receptor + "/" + username)); // Generate a unique key for the new message

//     // Set the message data under the unique key
//     set(newMessageRef, {
//       sender: username,
//       body: body,
//     });

//     const newMessageRef2 = push(ref(db, "chats/" + username + "/" + receptor)); // Generate a unique key for the new message

//     // Set the message data under the unique key
//     set(newMessageRef2, {
//       sender: username,
//       body: body,
//     });
//   };

//   return (
//     <View>
//       <Button
//         labelStyle={{ color: textLight }}
//         mode="contained"
//         onPress={addDataOn}
//       >
//         Send Message
//       </Button>
//     </View>
//   );
// };

const Messages = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <ChatList navigation={navigation} />
    </View>
  );
};

export default Messages;

import {
  accent,
  background,
  primaryColor,
  secondaryColor,
  textLight,
} from "../../../components/colors";
import { Navigation } from "../../../types/types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    width: width,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: primaryColor,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: "6%",
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});
