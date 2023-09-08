import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from './Feed';

const FeedStack = createNativeStackNavigator();

const FeedStackScreen = () => {
    return (
        <FeedStack.Navigator>
          <FeedStack.Screen options={{title:""}} name="Feed2" component={Feed} />
        </FeedStack.Navigator>
      );
}

export default FeedStackScreen