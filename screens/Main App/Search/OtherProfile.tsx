import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { Navigation } from '../../../types/types';
import { useRoute } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '@env';

const apiUrl = API_URL

const { height } = Dimensions.get("window");

type Props = {
    navigation: Navigation;
  };
  
type RouteParams = {
    params: any;
    key: string;
    name: string;
    path?: string | undefined;
};

function OtherProfile({ navigation }: Props) {
  const route = useRoute<RouteParams>();
  const data = route.params;

  const [displayName, setDisplayName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [followers, setFollowers] = React.useState("0");
  const [followed, setFollowed] = React.useState("0");

  const [isLoading, setisLoading] = useState(true);

  const getData = async () => { 
    if (data.username != null) {
      let api_result: AxiosResponse<any, any>
      try {
        api_result = await axios.get(`${API_URL}/profile/${data.username}`); // TODO ver si se esta siguiendo
        setDisplayName(api_result.data.displayName)
        setLocation(api_result.data.location)
        setBio(api_result.data.biography)
        setFollowed(api_result.data.followed)
        setFollowers(api_result.data.followers)
        setisLoading(false)
      } catch (e) {
        alert((e as any).response.data.message)
      }
    }
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{ justifyContent: "center", marginVertical: height / 2.5 }}>
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <><Image source={{
            uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
            style={styles.profileImage} /><Button
              style={styles.followButton}
              mode="outlined"
              onPress={async () => {
                try {
                  const response = await axios.post(`${apiUrl}/content/follow/${data.username}`);
                } catch (e) {
                  alert((e as any).response.data.message);
                }
              } }
            >
              Follow
            </Button><View style={styles.userInfoContainer}>
              <Text style={styles.displayname}>{displayName}</Text>
              <Text style={styles.bio}>{"@"}{data.username}</Text>
              <Text style={styles.bio}>{location}</Text>
              <Text style={styles.bio}>{bio}</Text>
              <Text style={styles.bio}>
                <Text style={{fontWeight: "bold"}}>{followed}</Text> following{" "}
                <Text style={{fontWeight: "bold"}}>{followers}</Text> followers
              </Text>
            </View></>
        )}
    </View>
      
  );
}

export default OtherProfile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    userInfoContainer: {
        borderRadius: 10,
        backgroundColor: "#ccc",
        width: "90%",
        padding: 10,
        marginBottom: 10,
    },
    displayname: {
        fontSize: 20,
        fontWeight: "bold",
      },
    bio: {
        fontSize: 16,
        marginTop: 5,
    },
        profileImage: {
        width: 110,
        height: 110,
        borderRadius: 75,
        marginTop: 55,
        marginBottom: 15,
    },
    followButton: {
        marginBottom: 15,
        width: 120,
        height: 45,
    },
});