import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
} from "react-native-paper";
import React, { useCallback } from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { useState, useEffect } from "react";
import {
  deleteIndieNotificationInbox,
  getIndieNotificationInbox,
} from "native-notify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Navigation } from "../../../types/types";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import { API_URL } from "@env";
import axios from "axios";
import { secondaryColor } from "../../../components/colors";

type Notification = {
  notification: NotificationData;
};

type NotificationList = {
  data: NotificationData[];
};

type NotificationData = {
  date: string;
  message: string;
  title: string;
  notification_id: string;
};
type Props = {
  navigation: Navigation;
};

export default function Notifications({ navigation }: Props) {
  const { onLogout } = useAuth();
  const [data, setData] = useState<NotificationData[]>([]);
  const [post, setPost] = useState();
  const NotificationCard = ({ notification }: Notification) => {
    /*
    Notification formats
    --> Message received: title = $sender_username  ,body = message text
    --> Mentioned:        title = SnapMsg Mention   ,body = Mentioned in a tweet $tweet_id
    --> Trending:         title = Trending post     ,body = Trending tweet related to [topic] $tweet_id 
    */

    let navigateFunction: (id: String) => void;
    // Title length = 1 word --> message notification
    if (notification.title.split(" ").length === 1) {
      navigateFunction = async () => {
        navigation.navigate("Messages", {
          screen: "ChatWindow",
          params: { username: notification.title },
        });

        try {
          await handleDeleteNotification(notification.notification_id);
        } catch (e) {
          //
        }
      };

      // Else, mention or trending post notification
    } else {
      let id =
        notification.message.split(" ")[
          notification.message.split(" ").length - 1
        ];
      navigateFunction = async () => {
        navigation.navigate("SnapMSGDetails", { id: parseInt(id) });
        try {
          await handleDeleteNotification(notification.notification_id);
        } catch (e) {
          //
        }
      };
    }

    return (
      <Card
        style={styles.card}
        onPress={() => navigateFunction(notification.notification_id)}
      >
        <Card.Content>
          <View style={styles.cardTitle}>
            <Title>{notification.title}</Title>
            <IconButton
              icon="trash-can"
              style={{ backgroundColor: "black" }}
              onPress={async () => {
                try {
                  await handleDeleteNotification(notification.notification_id);
                } catch (e) {
                  //
                }
              }}
            />
          </View>
          <Paragraph>{notification.message}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsLoading(true);
    setRefreshing(true);
    handleEffect();
    setRefreshing(false);
    setIsLoading(false);
  }, []);

  const NotificationsList = ({ data }: NotificationList) => {
    return (
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <NotificationCard key={index} notification={item} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const username = await AsyncStorage.getItem("username");
    let notifications = await deleteIndieNotificationInbox(
      username,
      notificationId,
      16227,
      "F0db46mP8E0ETDYekxQxr0"
    );
    setData(notifications);
  };

  const handleEffect = async () => {
    const username = await AsyncStorage.getItem("username");

    let notifications = await getIndieNotificationInbox(
      username,
      16227,
      "F0db46mP8E0ETDYekxQxr0"
    );
    //console.log(notifications);
    setIsLoading(false);
    setData(notifications);
  };

  useFocusEffect(
    React.useCallback(() => {
      handleEffect();

      // Set up an interval to run the effect every 5 seconds
      // const intervalId = setInterval(() => {
      //   handleEffect();
      // }, 5000); // 5000 milliseconds = 5 seconds

      // // Clear the interval when the component unmounts
      // return () => {
      //   clearInterval(intervalId);
      // };
    }, [])
  );

  const [isLoading, setIsLoading] = useState(true);
  

  return (
    <View style={styles.container}>
      {data.length ? (
        <View>
          {isLoading ? (
            <View style={{ justifyContent: "center" }}>
              <ActivityIndicator size="large" animating={true} />
            </View>
          ) : (
            <View style={styles.itemsContainer}>
              <NotificationsList data={data} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.message}>Notification Center</Text>
          <Text style={{ marginTop: 5 }}>Incoming Messages and Mentions!</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: secondaryColor,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: "5%",
  },
  itemsContainer: {
    margin: 1,
  },
  card: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
  },
  cardTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
});
