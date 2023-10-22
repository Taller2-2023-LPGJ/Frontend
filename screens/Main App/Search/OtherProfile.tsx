import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { Navigation } from '../../../types/types';
import { useRoute } from '@react-navigation/native';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '@env';
import FeedTemplate from '../Feed/FeedTemplate';

const apiUrl = API_URL

const { height, width } = Dimensions.get("window");

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
  const [followers, setFollowers] = React.useState(0);
  const [followed, setFollowed] = React.useState(0);
  const [following, setFollowing] = React.useState(false);

  const [isLoading, setisLoading] = useState(true);

  const getData = async () => {
    if (data.username != null) {
      let api_result: AxiosResponse<any, any>;
      try {
        api_result = await axios.get(`${API_URL}/profile/${data.username}`); // TODO ver si se esta siguiendo
        setDisplayName(api_result.data.displayName);
        setLocation(api_result.data.location);
        setBio(api_result.data.biography);
        setFollowed(api_result.data.followed)
        setFollowers(api_result.data.followers)
        setFollowing(api_result.data.following)
        setisLoading(false);
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };
  useEffect(() => {
    setisLoading(true)
    getData();
  }, [data]);

  return (
    <ScrollView contentContainerStyle={{alignItems:"center", backgroundColor:background}} nestedScrollEnabled={true}>
      {isLoading ? (
        <View
          style={{ justifyContent: "center", marginVertical: height / 2.5 }}
        >
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <View>
          <Image 
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
          }}
          style={styles.profileImage}
          />

          {following ? 
          (<View>
            <Button
              style={styles.followButton}
              labelStyle={{color:textLight}}
              mode="outlined"
              onPress={async () => {
                try {
                  await axios.delete(`${apiUrl}/content/follow/${data.username}`);
                  setFollowing(!following)
                  setFollowers(followers-1)
                } catch (e) {
                  alert((e as any).response.data.message);
                }
              } }
              >
                Unfollow
              </Button>
            </View>)
            :
              (<Button
                style={styles.followButton}
                labelStyle={{color:textLight}}
                mode="outlined"
                onPress={async () => {
                  try {
                    const response = await axios.post(`${apiUrl}/content/follow/${data.username}`);
                    setFollowing(!following)
                    setFollowers(followers+1)
                  } catch (e) {
                    alert((e as any).response.data.message);
                  }
                } }
              >
                Follow
              </Button>
              )
            }

          <View style={styles.userInfoContainer}>
            <Text style={styles.displayname}>{displayName}</Text>
            <Text style={styles.bio}>{"@"}{data.username}</Text>
            <Text style={styles.bio}>{location}</Text>
            <Text style={styles.bio}>{bio}</Text>
            <Text style={styles.bio}>
              <Text style={{fontWeight: "bold"}}>{followed}</Text> following{" "}
              <Text style={{fontWeight: "bold"}}>{followers}</Text> followers
            </Text>
          </View>
            
          <View style={styles.postsContainer}>
            {data.username != ""? <FeedTemplate navigation={navigation} feedType="ProfileFeed" feedParams={{username:data.username, id:-1}}></FeedTemplate>:null}
          </View>
        </View>
        )}
    </ScrollView>  
  );
}

export default OtherProfile;
import { accent, background, primaryColor, secondaryColor, textLight} from "../../../components/colors";



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 15,
    marginBottom: 15,
    alignSelf:"center"
  },
  editProfileButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: primaryColor,
    paddingHorizontal: 10,
  },
  userInfoContainer: {
    borderRadius: 5,
    width: width-50,
    padding: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: primaryColor,
    alignSelf:"center"
  },
  displayname: {
    fontSize: 20,
    fontWeight: "bold",
    color:textLight,
  },
  bio: {
    fontSize: 16,
    marginTop: 5,
    color:textLight,
  },
  followCount: {
    fontSize: 16,
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  postsContainer: {
    borderRadius: 5,
    height: height - 165,
    width: width-50,
    borderWidth: 2,
    borderColor: primaryColor,
    backgroundColor:secondaryColor,
    alignSelf:'center'
  },
  displaynameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  location: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  followButton: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: primaryColor,
    borderColor:primaryColor,
    width: "40%",
  },
});