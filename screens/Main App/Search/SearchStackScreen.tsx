import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from './Search';


const SearchStack = createNativeStackNavigator();

const SearchStackScreen = () => {
    return (
        <SearchStack.Navigator>
          <SearchStack.Screen options={{title:""}} name="Search2" component={Search} />
        </SearchStack.Navigator>
      );
}

export default SearchStackScreen