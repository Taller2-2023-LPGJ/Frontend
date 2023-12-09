import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notifications from './Notifications';

const NotificationsStack = createNativeStackNavigator();

const NotificationsStackScreen = () => {
    return (
        <NotificationsStack.Navigator>
          <NotificationsStack.Screen options={{title:"",headerShown:false}} name="Alerts2" component={Notifications} />
        </NotificationsStack.Navigator>
      );
}

export default NotificationsStackScreen