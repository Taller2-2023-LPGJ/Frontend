import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from './EditProfile';
import Profile from './Profile';
import SnapMSGDetails from '../Feed/SnapMSGDetails';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator>
          <ProfileStack.Screen options={{title:""}} name="Profile2" component={Profile} />
          <ProfileStack.Screen options={{title:""}} name="EditProfile" component={EditProfile} />
          <ProfileStack.Screen options={{title:""}} name="SnapMSGDetails" component={SnapMSGDetails} />
        </ProfileStack.Navigator>
      );
}

export default ProfileStackScreen