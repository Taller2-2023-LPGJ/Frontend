import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from "react-native";
import { ActivityIndicator, Button, Text, TextInput } from "react-native-paper";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
import { firebase } from "../../../components/config";
import * as FileSystem from "expo-file-system";

const { height } = Dimensions.get("window");

const EditProfile = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [isLoadingProfileData, setIsLoadingProfileData] = useState(true);
  const [isUploadingImage, setisUploadingImage] = useState(false);
  const [profilePicture, setprofilePicture] = useState(
    "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245"
  );

  const pickImage = async () => {
    // no permissions request is necessary for launching the img library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    } else {
      return "";
    }
  };

  const uploadMedia = async (selectedImage: string) => {
    try {
      const { uri } = await FileSystem.getInfoAsync(selectedImage);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request Failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const ref = firebase.storage().ref().child(`${username}/avatar`);
      const snapshot = await ref.put(blob as Blob | Uint8Array | ArrayBuffer);

      // Get the download URL of the uploaded image to store in the DB
      const downloadURL = await snapshot.ref.getDownloadURL();

      await ref.put(blob as Blob | Uint8Array | ArrayBuffer);

      // TODO actualizar el URL en la base de datos de profile el nuevo url
      setprofilePicture(downloadURL);
    } catch (error) {
      console.error(error);
    }
  };

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
        setUsername(api_result.data.username);
        setDisplayName(api_result.data.displayName);
        setLocation(api_result.data.location);
        setBio(api_result.data.biography);
        setIsLoadingProfileData(false);
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUploadButton = async () => {
    const selectedImage = await pickImage();

    if (selectedImage !== "") {
      setisUploadingImage(true);
      await uploadMedia(selectedImage);
      setisUploadingImage(false);
      return;
    }
  };

  const handleRemoveButton = async () => {
    // TODO actualizar el campo en la db
    // set Uploading image(true)
    setprofilePicture(
      "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245"
    );
    // set Uploading image(false)
  };

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
    <ScrollView>
      <View style={styles.container}>
        {isLoadingProfileData ? (
          <View
            style={{ justifyContent: "center", marginVertical: height / 2.5 }}
          >
            <ActivityIndicator size="large" animating={true} />
          </View>
        ) : (
          <View>
            <View style={styles.topContainer}>
              {isUploadingImage ? (
                <View
                  style={{
                    width: 200,
                    height: 200,
                    alignContent: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <ActivityIndicator color="#0000ff" />
                </View>
              ) : (
                <Image
                  source={{
                    uri: profilePicture,
                  }}
                  style={styles.profileImage}
                />
              )}

              <View style={styles.buttonsContainer}>
                <Button
                  style={styles.uploadButton}
                  mode="contained"
                  onPress={handleUploadButton}
                >
                  Upload
                </Button>

                <Button
                  style={styles.removeButton}
                  mode="contained"
                  onPress={handleRemoveButton}
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
        )}
      </View>
    </ScrollView>
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
