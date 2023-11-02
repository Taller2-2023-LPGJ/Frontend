import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { Button, Text } from "react-native-paper";
import React, { useCallback } from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { useState, useEffect } from "react";
import {
  deleteIndieNotificationInbox,
  getIndieNotificationInbox,
  getPushDataInForeground,
  getPushDataObject,
} from "native-notify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { background } from "../../../components/colors";
import { Navigation } from "../../../types/types";
import { useFocusEffect } from "@react-navigation/native";

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
  const [data, setData] = useState<NotificationData[]>([]);
  const NotificationCard = ({ notification }: Notification) => {
    return (
      <Card
        style={styles.card}
        onPress={() =>
          console.log(
            `navigate to snapmsg id: ${notification.title.split(" ")[1]}`
          )
        }
      >
        <Card.Content>
          <View style={styles.cardTitle}>
            <Title>{notification.title.split(" ")[0]}</Title>
            <Button
              mode="contained"
              style={{ backgroundColor: "#FF6B6B" }}
              onPress={async () =>
                await handleDeleteNotification(notification.notification_id)
              }
            >
              X
            </Button>
          </View>
          <Paragraph>{notification.message}</Paragraph>
          <Paragraph>At: {notification.date}</Paragraph>
          <Paragraph>Id: {notification.title.split(" ")[1]}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleEffect();
    setRefreshing(false);
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
      13586,
      "SKYebTHATCXWbZ1Tlwlwle"
    );
    setData(notifications);
  };

  const handleEffect = async () => {
    const username = await AsyncStorage.getItem("username");

    let notifications = await getIndieNotificationInbox(
      username,
      13586,
      "SKYebTHATCXWbZ1Tlwlwle"
    );
    console.log(notifications);
    setData(notifications);
  };

  useFocusEffect(
    React.useCallback(() => {
      handleEffect();
    }, [])
  );

  return (
    <View style={styles.container}>
      {data.length ? (
        <View style={styles.itemsContainer}>
          <NotificationsList data={data} />
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.message}>
            Your notifications will appear here
          </Text>
          <Text style={{ marginTop: 5 }}>
            Incoming messages, mentions, and trending posts!
          </Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
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
    marginBottom: 20,
  },
  cardTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
