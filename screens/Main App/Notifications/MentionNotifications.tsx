import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { Card, Title, Paragraph } from "react-native-paper";
import { useState, useEffect } from "react";
import { getIndieNotificationInbox } from "native-notify";


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
};

// Todo: Mejorar estilo
const NotificationCard = ({ notification }: Notification) => {
  return (
    <Card>
      <Card.Content>
        <Title>{notification.title}</Title>
        <Paragraph>{notification.message}</Paragraph>
        <Paragraph>{notification.date}</Paragraph>
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


// Recibe props navigation, if username fetch fail --> goBack?

export default function MentionNotifications() {
  const [data, setData] = useState<NotificationData[]>([]);

  const handleEffect = async () => {
    let notifications = await getIndieNotificationInbox(
      "lucas1234", // TODO: usar username
      13586,
      "SKYebTHATCXWbZ1Tlwlwle"
    );
    setData(notifications);
  };

  useEffect(() => {
    handleEffect();
  }, []);

  // ScrollView
  return (
    <View style={styles.container}>
      {data ? (
        <View>
          <NotificationsList data={data} />
        </View>
      ) : (
        <View>
          <Text>0 Notifications</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
