import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Image, TextInput, Text } from "react-native";
import { Button } from "react-native-paper";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";

const EditProfile = () => {
  
  const [displayName, setDisplayName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");

  const tryEditProfile = async () => { 
    const result = await AsyncStorage.getItem('username');
    if (result !== null) {
      let api_result: AxiosResponse<any, any>
      try {
          console.log(result) // API Edit profile
        } catch (e) {
          alert((e as any).response.data.message)
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={{
            uri:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          }}
          style={styles.profileImage}
        />

        <View style={styles.buttonsContainer}>
          <Button
            style={styles.uploadButton}
            mode="outlined"
            onPress={() => {
              // Handle
            }}
          >
            Upload
          </Button>

          <Button
            style={styles.removeButton}
            mode="outlined"
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
            style={styles.input}
            value={bio}
            onChangeText={(text) => setBio(text)}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Birth Date</Text>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={(text) => setBirthDate(text)}
          />
        </View>

        <Button
            style={styles.removeButton}
            mode="outlined"
            onPress={() => {
              tryEditProfile()
            }}
          >
            Save
        </Button>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  topContainer: {
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#ccc",
    padding: 20,
    width: "90%",
    marginBottom: 10,
    marginTop: 10,
  },
  profileImage: {
    width: 135,
    height: 135,
    borderRadius: 75,
    marginLeft: 20,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  uploadButton: {
    width: 120,
    marginBottom: 10,
  },
  removeButton: {
    width: 120,
    marginBottom: 10,
  },
  saveButton: {
    width: 120,
    marginBottom: 10,
  },
  bottomContainer: {
    borderRadius: 10,
    flex: 1,
    width: "90%",
    backgroundColor: "#ccc",
    marginBottom: 10,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    padding: 8,
  },
});

export default EditProfile;
