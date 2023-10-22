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
        <FeedTemplate navigation={navigation} feedType="GeneralFeed" feedParams={{username:"", id:-1}}></FeedTemplate>
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          style={styles.writeSnapMSGButton}
          labelStyle={styles.buttonLabelStyle}
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
import { background, primaryColor, secondaryColor, textLight } from "../../../components/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: primaryColor
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    backgroundColor: background,
    width: "100%",
  },
  feedContainer: {
    height: "85%",
    width: "100%",
    marginBottom: 3,
    alignItems: "center",
    backgroundColor: secondaryColor,
  },
  writeSnapMSGButton: {
    marginBottom: 15,
    width: 170,
    height: 45,
    borderColor: primaryColor,
    backgroundColor:primaryColor,
  },
  buttonLabelStyle: {
    color:textLight
  }
});
