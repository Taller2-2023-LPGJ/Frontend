import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from './Feed';
import SnapMSGDetails from './SnapMSGDetails';
import WriteSnapMSG from './WriteSnapMSG';
import EditSnapMSG from './EditSnapMSG';
import ReplySnapMSG from './ReplySnapMSG';

const FeedStack = createNativeStackNavigator();



const FeedStackScreen = () => {
    return (
        <FeedStack.Navigator>
          <FeedStack.Screen options={{title:"", headerShown:false}} name="Feed2" component={Feed} />
          <FeedStack.Screen options={{title:""}} name="SnapMSGDetails" component={SnapMSGDetails} />
          <FeedStack.Screen options={{title:""}} name="WriteSnapMSG" component={WriteSnapMSG} />
          <FeedStack.Screen options={{title:""}} name="EditSnapMSG" component={EditSnapMSG} />
          <FeedStack.Screen options={{title:""}} name="ReplySnapMSG" component={ReplySnapMSG} />
        </FeedStack.Navigator>
      );
}

export default FeedStackScreen