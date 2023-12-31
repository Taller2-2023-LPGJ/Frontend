import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  HelperText,
} from "react-native-paper";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
import { firebase } from "../../../components/config";
import * as FileSystem from "expo-file-system";

const { height } = Dimensions.get("window");
const default_avatar =
  "https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245";

const EditProfile = () => {
  const { onLogout } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [currentProfilePicture, setCurrentProfilePicture] = useState("");

  const [isLoadingProfileData, setIsLoadingProfileData] = useState(true);
  const [isUploadingImage, setisUploadingImage] = useState(false);
  const [profilePicture, setprofilePicture] = useState("");

  const pickImage = async () => {
    // no permissions request is necessary for launching the img library
    setisUploadingImage(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setisUploadingImage(false);
      return result.assets[0].uri;
    } else {
      setisUploadingImage(false);
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
      const downloadURL = await snapshot.ref.getDownloadURL();
      await ref.put(blob as Blob | Uint8Array | ArrayBuffer);
      setprofilePicture(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error(error);
      return "";
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
        setprofilePicture(api_result.data.profilePicture);
        setCurrentProfilePicture(api_result.data.profilePicture);
        setIsLoadingProfileData(false);
      } catch (e) {
        if (
          (e as any).response.status == "401" ||
          (e as any).response.data.message.includes("blocked")
        ) {
          onLogout!();
          alert((e as any).response.data.message);
        } else {
          alert((e as any).response.data.message);
        }
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUploadButton = async () => {
    const selectedImage = await pickImage();
    if (selectedImage !== "") {
      setprofilePicture(selectedImage);
    }

    // if (selectedImage !== "") {
    //   setisUploadingImage(true);
    //   await uploadMedia(selectedImage);
    //   setisUploadingImage(false);
    //   return;
    // }
  };

  const handleRemoveButton = async () => {
    setprofilePicture(default_avatar);
  };

  const tryEditProfile = async () => {
    setIsLoadingProfileData(true);
    if (displayName == "") {
      alert("Can't leave your display name empty");
      setIsLoadingProfileData(false);
    } else if (hasErrorsBio()) {
      alert("Bio is too long");
      setIsLoadingProfileData(false);
    } else if (hasErrorsDisplayName()) {
      alert("Display name is too long");
      setIsLoadingProfileData(false);
    } else if (hasErrorsLocation()) {
      alert("Location is too long");
      setIsLoadingProfileData(false);
    } else {
      const result = await AsyncStorage.getItem("username");
      let pp_url = "";
      if (profilePicture !== currentProfilePicture) {
        if (profilePicture !== default_avatar) {
          pp_url = await uploadMedia(profilePicture);
        } else {
          pp_url = default_avatar;
        }
      } else {
        pp_url = profilePicture;
      }

      if (pp_url === "") {
        setIsLoadingProfileData(false);
        alert("Error uploading Profile Picture");
        return;
      }

      if (result != null) {
        let api_result: AxiosResponse<any, any>;
        try {
          const body = {
            displayName: displayName.trim(),
            location: location.trim(),
            biography: bio.trim(),
            profilePicture: pp_url,
          };
          api_result = await axios.put(`${API_URL}/profile`, body);
          setIsLoadingProfileData(false);
          navigation.goBack();
        } catch (e) {
          setIsLoadingProfileData(false);
          if (
            (e as any).response.status == "401" ||
            (e as any).response.data.message.includes("blocked")
          ) {
            onLogout!();
            alert((e as any).response.data.message);
          } else {
            alert((e as any).response.data.message);
          }
        }
      }
    }
  };

  const hasErrorsDisplayName = () => {
    return displayName !== null && displayName.length > 15;
  };

  const hasErrorsLocation = () => {
    return location !== null && location.length > 20;
  };

  const hasErrorsBio = () => {
    return bio !== null && bio.length > 80;
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
                  labelStyle={{ color: textLight }}
                >
                  Upload
                </Button>

                <Button
                  style={styles.removeButton}
                  mode="contained"
                  onPress={handleRemoveButton}
                  labelStyle={{ color: textLight }}
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
                <HelperText type="error" visible={hasErrorsDisplayName()}>
                  Display name must not exceed 15 characters
                </HelperText>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={(text) => setLocation(text)}
                />
                <HelperText type="error" visible={hasErrorsLocation()}>
                  Location must not exceed 20 characters
                </HelperText>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={styles.inputBio}
                  value={bio}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  onChangeText={(text) => setBio(text)}
                />
                <HelperText type="error" visible={hasErrorsBio()}>
                  Location must not exceed 80 characters
                </HelperText>
              </View>

              <Button
                style={styles.saveButton}
                labelStyle={{ color: textLight }}
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

import {
  accent,
  background,
  primaryColor,
  secondaryColor,
  textLight,
} from "../../../components/colors";
import { useAuth } from "../../../context/AuthContext";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: background,
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
    backgroundColor: primaryColor,
  },
  removeButton: {
    width: 120,
    marginBottom: 10,
    backgroundColor: "#743939",
  },
  saveButton: {
    width: 120,
    marginBottom: 10,
    marginTop: 20,
    alignSelf: "flex-end",
    backgroundColor: primaryColor,
  },
  bottomContainer: {
    flex: 1,
    width: "90%",
    marginBottom: 20,
    padding: 5,
  },
  fieldContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    fontSize: 16,
    borderRadius: 5,
    width: width * 0.9,
  },
  inputBio: {
    fontSize: 16,
    borderRadius: 5,
  },
});

export default EditProfile;
