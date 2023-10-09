import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from './Feed';
import SnapMSGDetails from './SnapMSGDetails';
import FeedTemplate from './FeedTemplate';
import WriteSnapMSG from './WriteSnapMSG';

const FeedStack = createNativeStackNavigator();

const FeedStackScreen = () => {
    return (
        <FeedStack.Navigator>
          <FeedStack.Screen options={{title:""}} name="Feed2" component={Feed} />
          <FeedStack.Screen options={{title:""}} name="SnapMSGDetails" component={SnapMSGDetails} />
          <FeedStack.Screen options={{title:""}} name="WriteSnapMSG" component={WriteSnapMSG} />
        </FeedStack.Navigator>
      );
}

export default FeedStackScreen