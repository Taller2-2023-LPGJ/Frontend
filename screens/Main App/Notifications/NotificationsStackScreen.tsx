import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MentionNotifications from './MentionNotifications';

const NotificationsStack = createNativeStackNavigator();

const NotificationsStackScreen = () => {
    return (
        <NotificationsStack.Navigator>
          <NotificationsStack.Screen options={{title:"Mention Alerts"}} name="MentionAlerts" component={MentionNotifications} />
        </NotificationsStack.Navigator>
      );
}

export default NotificationsStackScreen