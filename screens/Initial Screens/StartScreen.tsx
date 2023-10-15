import { Dimensions, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Text,
  TextInput,
} from "react-native-paper";
import { Navigation } from "../../types/types";
import Logo from "../../components/Logo";

import { TouchableOpacity, SafeAreaView, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import * as FileSystem from "expo-file-system";

type Props = {
  navigation: Navigation;
};

const { width } = Dimensions.get("window");

const UploadMediaFile = () => {
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // no permissions request is necessary for launching the img library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const downloadMessi = async () => {
    const storage = firebase.storage();
    const imageRef = storage.ref().child("lucas/avatar");

    imageRef
      .getDownloadURL()
      .then((url) => {
        // Now you can use this URL to display the image in your app
        console.log(url);
        setImage(url);
        setLoadingImage(false);
      })
      .catch((e: any) => {
        // Handle any errors that may occur
        console.error(e);
      });
  };

  const uploadMedia = async () => {
    setUploading(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(image);
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

      const ref = firebase.storage().ref().child(`username/twittid124/img`);
      const snapshot = await ref.put(blob as Blob | Uint8Array | ArrayBuffer);

      // Get the download URL of the uploaded image to store in the DB
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log(downloadURL)

      await ref.put(blob as Blob | Uint8Array | ArrayBuffer);
      setUploading(false);
      Alert.alert("Photo uploaded!");
      setImage("");
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <SafeAreaView style={{ width: width * 0.5 }}>
      <TouchableOpacity onPress={pickImage}>
        <Text>Pick an image</Text>
      </TouchableOpacity>
      <View>
        {/* Dentro del loading image, el style es igual para ambos (imageContainer) entonces
        El activity indicator se ve en el lugar de la img*/}
        {loadingImage ? (
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
          <View style={{ width: 200, height: 200 }}>
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}

        <TouchableOpacity onPress={uploadMedia}>
          <Text>Upload an image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={downloadMessi}>
          <Text>See</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const StartScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text}>SnapMsg</Text>

      <View>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>

        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Button>

        {/* <Button
          style={styles.button}
          mode="contained"
          onPress={() => console.log("nada")}
        >
          Upload Image
        </Button> */}

        <UploadMediaFile />
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 8,
    width: width * 0.65,
  },
  text: {
    marginBottom: 40,
    fontSize: width * 0.05,
  },
});
