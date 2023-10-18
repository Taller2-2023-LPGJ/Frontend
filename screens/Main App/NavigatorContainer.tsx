import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import ProfileStackScreen from './Profile/ProfileStackScreen';
import Profile from './Profile/Profile';
import SettingsStackScreen from './Settings/SettingsStackScreen';

const SettingsStack = createNativeStackNavigator();

const NavigatorContainer = () => {
    return (
        <SettingsStack.Navigator>
          <SettingsStack.Screen options={{title:"",headerShown:false}} name="TabNav9" component={TabNavigator}/>
          <SettingsStack.Screen options={{title:"",headerShown:false}} name="Profile9" component={ProfileStackScreen}/>
          <SettingsStack.Screen options={{title:"",headerShown:false}} name="Settings9" component={SettingsStackScreen}/>
        </SettingsStack.Navigator>
      );
}

export default NavigatorContainer