import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from './EditProfile';
import Profile from './Profile';
import SnapMSGDetails from '../Feed/SnapMSGDetails';
import UserStats from './UserStats';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
          <ProfileStack.Screen options={{title:"",headerShown:false}} name="Profile2" component={Profile} />
          <ProfileStack.Screen options={{title:"Edit profile"}} name="EditProfile" component={EditProfile} />
          <ProfileStack.Screen options={{title:""}} name="SnapMSGDetails" component={SnapMSGDetails} />
          <ProfileStack.Screen options={{title:"SnapMsg Analytics"}} name="User Stats" component={UserStats} />
        </ProfileStack.Navigator>
      );
}

export default ProfileStackScreen