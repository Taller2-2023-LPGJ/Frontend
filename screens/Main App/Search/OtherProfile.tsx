import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import { ActivityIndicator, Button,Text} from "react-native-paper";
import { Navigation } from "../../../types/types";
import { useRoute } from "@react-navigation/native";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";

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

  const [isLoading, setisLoading] = useState(true);

  const getData = async () => {
    if (data.username != null) {
      let api_result: AxiosResponse<any, any>;
      try {
        api_result = await axios.get(`${API_URL}/profile/${data.username}`);
        setDisplayName(api_result.data.displayName);
        setLocation(api_result.data.location);
        setBio(api_result.data.biography);
        setisLoading(false);
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{ justifyContent: "center", marginVertical: height / 2.5 }}
        >
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
            }}
            style={styles.profileImage}
          />
          <View style={styles.buttonContainer}>
            <Button
              style={styles.followButton}
              mode="outlined"
              onPress={() => {
                console.log("Followed user");
              }}
            >
              Follow
            </Button>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.displayname}>{displayName}</Text>
            <Text style={styles.bio}>
              {"@"}
              {data.username}
            </Text>
            <Text style={styles.bio}>{location}</Text>
            <Text style={styles.bio}>{bio}</Text>
          </View>
        </>
      )}
    </View>
  );
}

export default OtherProfile;
import { primaryColor} from "../../../components/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  userInfoContainer: {
    borderRadius: 5,
    width: "90%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: primaryColor,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
    marginBottom: 10,
  },
  followButton: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
});
