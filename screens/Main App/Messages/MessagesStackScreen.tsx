import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Messages from './Messages';
import ChatWindow from './ChatWindow';

const MessagesStack = createNativeStackNavigator();

const MessagesStackStackScreen = () => {
    return (
        <MessagesStack.Navigator>
          <MessagesStack.Screen options={{title:"Messages",headerShown:false}} name="Chats" component={Messages} />
          <MessagesStack.Screen options={{title:""}} name="ChatWindow" component={ChatWindow} />
        </MessagesStack.Navigator>
      );
}

export default MessagesStackStackScreen