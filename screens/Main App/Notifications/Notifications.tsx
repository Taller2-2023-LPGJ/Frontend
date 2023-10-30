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
import { background } from "../../../components/colors";

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

export default function Notifications() {
  const [data, setData] = useState<NotificationData[]>([]);
  const NotificationCard = ({ notification }: Notification) => {

    return (
      <Card
        style={styles.card}
        onPress={() => console.log(`navigate to snapmsg id: ${notification.title.split(' ')[1]}`)}
      >
        <Card.Content>
          <View style={styles.cardTitle}>
          <Title>{notification.title.split(' ')[0]}</Title>
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
          <Paragraph>Id: {notification.title.split(' ')[1]}</Paragraph>
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
  },);

  return (
    <ScrollView contentContainerStyle={{backgroundColor:background}}>
      <View style={styles.container}>
        {data ? (
          <View style={styles.itemsContainer}>
            <NotificationsList data={data} />
          </View>
        ) : (
          <View style={{backgroundColor:background}}>
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
    backgroundColor:background
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
