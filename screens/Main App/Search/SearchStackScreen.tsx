import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from './Search';
import OtherProfile from './OtherProfile';
import SearchUser from './SearchUser';
import SearchHashtag from './SearchHashtag';
import SearchSnapMSG from './SearchSnapMSG';


const SearchStack = createNativeStackNavigator();

const SearchStackScreen = () => {
    return (
        <SearchStack.Navigator>
          <SearchStack.Screen options={{title:""}} name="SearchUser" component={SearchUser} />
          <SearchStack.Screen options={{title:""}} name="OtherProfile" component={OtherProfile} />
          <SearchStack.Screen options={{title:""}} name="SearchHashtag" component={SearchHashtag} />
          <SearchStack.Screen options={{title:""}} name="SearchSnapMSG" component={SearchSnapMSG} />
        </SearchStack.Navigator>
      );
}

export default SearchStackScreen