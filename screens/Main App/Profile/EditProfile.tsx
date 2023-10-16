import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View, Image, KeyboardAvoidingView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const EditProfile = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [bio, setBio] = React.useState("");

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    const result = await AsyncStorage.getItem("username");
    if (result != null) {
      let api_result: AxiosResponse<any, any>;
      try {
        api_result = await axios.get(`${API_URL}/profile/${result}`);
        setDisplayName(api_result.data.displayName);
        setLocation(api_result.data.location);
        setBio(api_result.data.biography);
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const tryEditProfile = async () => {
    if (displayName == "") {
      alert("Can't leave your display name empty");
    } else {
      const result = await AsyncStorage.getItem("username");
      if (result != null) {
        let api_result: AxiosResponse<any, any>;
        try {
          const body = {
            displayName: displayName,
            location: location,
            biography: bio,
          };
          api_result = await axios.put(`${API_URL}/profile`, body);
          navigation.goBack();
        } catch (e) {
          alert((e as any).response.data.message);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245",
          }}
          style={styles.profileImage}
        />

        <View style={styles.buttonsContainer}>
          <Button
            style={styles.uploadButton}
            mode="contained"
            onPress={() => {
              // Handle
            }}
          >
            Upload
          </Button>

          <Button
            style={styles.removeButton}
            mode="contained"
            onPress={() => {
              // Handle
            }}
          >
            Remove
          </Button>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={(text) => setLocation(text)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.inputBio}
            value={bio}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            onChangeText={(text) => setBio(text)}
          />
        </View>

        <Button
          style={styles.saveButton}
          mode="contained"
          onPress={() => {
            tryEditProfile();
          }}
        >
          Save
        </Button>
      </View>
    </View>
  );
};

import { secondaryColor } from "../../../components/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  topContainer: {
    borderRadius: 10,
    flexDirection: "row",
    padding: 20,
    width: "90%",
    marginBottom: 5,
    marginTop: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginLeft: 10,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  uploadButton: {
    width: 120,
    marginBottom: 10,
    borderRadius: 0,
  },
  removeButton: {
    width: 120,
    marginBottom: 10,
    borderRadius: 0,
    backgroundColor: secondaryColor,
  },
  saveButton: {
    width: 120,
    marginBottom: 10,
    borderRadius: 0,
    marginTop: 20,
  },
  bottomContainer: {
    flex: 1,
    width: "90%",
    marginBottom: 20,
    padding: 5,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    borderRadius: 5,
  },
  inputBio: {
    fontSize: 16,
    borderRadius: 5,
  },
});

export default EditProfile;
