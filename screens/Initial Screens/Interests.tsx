import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Navigation } from "../../types/types";
import { ActivityIndicator, Button, Chip, Modal, Portal, Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

const USERS_SEARCH_URL =
  "https://t2-users-snap-msg-auth-user-julianquino.cloud.okteto.net/users/searchuser?user=";

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const { height } = Dimensions.get("window");
const categories = ["Politics", "Technology", "Music", "Travel", "Business"];

const Interests = ({ navigation }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const hideLoadingIndicator = () => {
    setLoadingVisible(false);
  };
  const showLoadingIndicator = () => {
    setLoadingVisible(true);
  };

  const route = useRoute<RouteParams>();
  const data = route.params;
  let username = data.username;

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getUsernameFromEmail();
  }, []);

  const getUsernameFromEmail = async () => {
    if (username.includes("@")) {
      try {
        const response = await axios.get(`${USERS_SEARCH_URL}${username}`, {});
        const respUsername = response.data.name;
        await AsyncStorage.setItem("username", respUsername);
        setisLoading(false);
      } catch (e) {
        setisLoading(false);
        return;
      }
    } else {
      setisLoading(false);
      return;
    }
  };

  const navigationAux = useNavigation();
  React.useEffect(() =>
    navigationAux.addListener("beforeRemove", (e) => {
      e.preventDefault();
    })
  );

  const handleSelect = (val: string) => {
    setSelectedCategories((prev: string[]) =>
      prev.find((p) => p === val)
        ? prev.filter((cat) => cat !== val)
        : [...prev, val]
    );
  };

  function handleContinue() {
    if (selectedCategories.length === 0) {
      alert("You must select at least 1 interest");
    } else {
      showLoadingIndicator();
      console.log("Selected categories: ", selectedCategories);
      hideLoadingIndicator();
      navigation.navigate("ChooseLocation", {
        username: username,
      });
    }
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{ justifyContent: "center", marginVertical: height / 2.5 }}
        >
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <View>
          <Portal>
            <Modal
              visible={loadingVisible}
              dismissable={false}
              contentContainerStyle={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <ActivityIndicator
                  animating={loadingVisible}
                  size="large"
                  color="#0000ff"
                />
              </View>
            </Modal>
          </Portal>
          <Text style={styles.text} variant="headlineMedium">
            Choose your interests
          </Text>

          <View style={styles.chipsContainer}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                mode="outlined"
                style={styles.chip}
                textStyle={{ fontWeight: "400", padding: 1 }}
                showSelectedOverlay
                selected={
                  selectedCategories.find((c) => cat === c) ? true : false
                }
                onPress={() => handleSelect(cat)}
              >
                {cat}
              </Chip>
            ))}
          </View>
          <View style={{ flexDirection: "row-reverse" }}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleContinue}
            >
              Continue
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default Interests;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    justifyContent: "center",
  },
  text: {
    marginBottom: 15,
    fontSize: width * 0.08,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    marginBottom: width * 0.05,
  },
  chip: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  button: {
    width: width * 0.4,
  },
});
