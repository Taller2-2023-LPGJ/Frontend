import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { useState, useEffect } from "react";
import {
  deleteIndieNotificationInbox,
  getIndieNotificationInbox,
} from "native-notify";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  // snapmsg_id y usar para navegar a pantalla con snapmsg
};

export default function Notifications() {
  const [data, setData] = useState<NotificationData[]>([]);
  const NotificationCard = ({ notification }: Notification) => {
    return (
      <Card
        style={styles.card}
        onPress={() => console.log("navigate to snapmsg")}
      >
        <Card.Content>
          <View style={styles.cardTitle}>
            <Title>{notification.title}</Title>
            <Paragraph
              onPress={async () =>
                await handleDeleteNotification(notification.notification_id)
              }
            >
              X
            </Paragraph>
          </View>
          <Paragraph>{notification.message}</Paragraph>
          <Paragraph>At: {notification.date}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const NotificationsList = ({ data }: NotificationList) => {
    return (
      <View>
        {data.map((notification, index) => (
          <NotificationCard key={index} notification={notification} />
        ))}
      </View>
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
    setData(notifications);
  };

  useEffect(() => {
    handleEffect();
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        {data ? (
          <View style={styles.itemsContainer}>
            <NotificationsList data={data} />
          </View>
        ) : (
          <View>
            <Text>0 Notifications</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
