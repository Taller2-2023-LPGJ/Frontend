import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Settings';

const SettingsStack = createNativeStackNavigator();

const SettingsStackScreen = () => {
    return (
        <SettingsStack.Navigator>
          <SettingsStack.Screen options={{title:"",headerShown:false}} name="Settings2" component={Settings} />
        </SettingsStack.Navigator>
      );
}

export default SettingsStackScreen