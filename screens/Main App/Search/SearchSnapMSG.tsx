import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from '../../../types/types';
import { background, primaryColor, secondaryColor, tertiaryColor, textLight } from '../../../components/colors';
import { useAuth } from '../../../context/AuthContext';
import { SnapMSG } from '../Feed/FeedTemplate';
import { ActivityIndicator } from "react-native-paper";

interface SnapMSGInfo {
  author: string;
  displayName: string;
  creationDate: string;
  body: string;
  editingDate: string;
  id: number;
  tags: string[];
  fav: boolean;
  liked: boolean;
  likes: number;
  parentId: number;
  sharedAt: string[];
  sharedBy: string[];
  shares: number;
  shared: boolean;
  privacy: boolean;
  picture: string;
  replies: number;
  verified: boolean;
}

type Props = {
  navigation: Navigation;
};

const SearchSnapMSG = ({ navigation }: Props) => {
  const { onLogout } = useAuth();

  const navigation2 = useNavigation();

  React.useEffect(() =>
  navigation2.addListener("beforeRemove", (e) => {
    e.preventDefault();
  })
  );

  const [snapMSGs, setSnapMSGs] = useState<SnapMSGInfo[]>([]);
  let [currentPage, setCurrentPage] = useState(0)
  let [noMoreResults, setNoMoreResults] = useState(false)
  let [loadingMoreResults, setLoadingMoreResults] = useState(false)

  const getSnapMSGs = async () => {
    setLoadingMoreResults(true)
    setSnapMSGs([])
    let api_result: AxiosResponse<any, any>
      try {
        let parsed_search = searchQuery
        if (searchQuery.startsWith('#')){
          parsed_search = searchQuery.replace(/#/g, "%23");
        }
        api_result = await axios.get(`${API_URL}/content/post?body=${parsed_search}&page=0`);
        if (api_result.data.message == null) {
          setSnapMSGs(api_result.data)
          setCurrentPage(1)
          if (api_result.data.length < 20) {
            setNoMoreResults(true)
          }
        }
      } catch (e) {
        if ((e as any).response.status == "401") {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }
    setLoadingMoreResults(false)
  }

  const loadMoreSnapMSGs = async () => {
    setLoadingMoreResults(true)
    let api_result: AxiosResponse<any, any>
    try {
      let parsed_search = searchQuery
      if (searchQuery.startsWith('#')){
        parsed_search = searchQuery.replace(/#/g, "%23");
      }
      api_result = await axios.get(`${API_URL}/content/post?body=${parsed_search}&page=${currentPage}`);
      if (api_result.data.message == null) {
        setSnapMSGs(snapMSGs.concat(api_result.data))
        setCurrentPage(currentPage+1)
        if (api_result.data.length < 20) {
          setNoMoreResults(true)
        }
      } else {
        setNoMoreResults(true)
      }
    } catch (e) {
      if ((e as any).response.status == "401") {
        onLogout!();
        alert((e as any).response.data.message);
      } else {
        alert((e as any).response.data.message);
      }
    }
    setLoadingMoreResults(false)
  }

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
  const onSubmitEditing = (_: any) => getSnapMSGs()


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Searchbar
      style={styles.searchBar}
      placeholder="Search"
      onChangeText={onChangeSearch}
      onSubmitEditing={onSubmitEditing}
      placeholderTextColor={textLight}
      inputStyle={{ color: textLight }}
      onClearIconPress={() => {
        setNoMoreResults(false)
        setSnapMSGs([])
      }}
      value={searchQuery} />
      {snapMSGs.map((snapMSG, index) => (
        <SnapMSG key={index} snapMSGInfo={snapMSG} navigation={navigation} scale={1} disabled={false}/>
      ))}
      {loadingMoreResults ? 
      <View style={{ justifyContent: "center", marginVertical: 20 }}>
        <ActivityIndicator size="large" animating={true} />
      </View>
      :(
        (snapMSGs.length == 0) || noMoreResults ? 
          <Text style={{color:textLight, alignSelf:"center", fontSize:18, padding:20}}>
            {noMoreResults ? "No more results": "Search for SnapMSGs!"}
          </Text>
          :
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreSnapMSGs}>
          <Text style={{color:textLight, alignSelf:"center"}}>Load more SnapMSGs</Text>
          </TouchableOpacity>
      )}
      
      
    </ScrollView>
  );
}

export default SearchSnapMSG;


const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: 5,
      backgroundColor:secondaryColor,
      flexGrow:1
    },
    userProfileContainer: {
      width: "90%",
      backgroundColor: tertiaryColor,
      padding: 15,
      borderRadius: 20,
      marginVertical: 8,
      flexDirection: "row",
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 75,
      marginRight: 15
    },
    displayname: {
      fontSize: 18,
      fontWeight: "bold",
      color:textLight,
    },
    username: {
      fontSize: 15,
      color:textLight,
    },
    namesContainer:{
      flexDirection:"column",
    },
    buttonContainer:{
      width: "100%",
      alignItems: "center",
    },
    searchBar: {
      width: '90%',
      alignSelf: 'center',
      marginBottom: 10,
      marginTop: 10,
      backgroundColor: primaryColor,
    },
    loadMoreButton: {
      padding:30, 
      backgroundColor:secondaryColor,
      width:"100%",
      borderBottomWidth:1,
      borderBottomColor:primaryColor,
    }
});