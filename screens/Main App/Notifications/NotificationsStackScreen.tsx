import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notifications from './Notifications';

const NotificationsStack = createNativeStackNavigator();

const NotificationsStackScreen = () => {
    return (
        <NotificationsStack.Navigator>
          <NotificationsStack.Screen options={{title:"Notifications"}} name="Alerts" component={Notifications} />
        </NotificationsStack.Navigator>
      );
}

export default NotificationsStackScreen