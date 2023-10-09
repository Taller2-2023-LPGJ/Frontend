import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import FeedTemplate from "./FeedTemplate";
import { Navigation } from "../../../types/types";

type Props = {
  navigation: Navigation;
};

const Feed = ({ navigation }: Props) => {
  const navigation2 = useNavigation();

  React.useEffect(() =>
    navigation2.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );

  return (
    <View style={styles.container}>
      <View style={styles.feedContainer}>
        <FeedTemplate navigation={navigation}></FeedTemplate>
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          style={styles.writeSnapMSGButton}
          mode="outlined"
          onPress={() => {navigation.navigate("WriteSnapMSG");}}
        >
          Write SnapMSG
        </Button>
      </View>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    backgroundColor: "#ccc",
    width: "100%",
  },
  feedContainer: {
    height: "85%",
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  writeSnapMSGButton: {
    marginBottom: 15,
    width: 170,
    height: 45,
  },
});
