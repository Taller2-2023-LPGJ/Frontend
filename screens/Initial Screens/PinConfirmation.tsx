import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";
import { API_URL } from "@env";
import axios from "axios";
import { registerIndieID } from "native-notify";
import * as SecureStore from "expo-secure-store";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Logo from "../../components/Logo";
import { Button } from "react-native-paper";
import { Navigation } from "../../types/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { background, primaryColor, textLight } from "../../components/colors";

const CELL_COUNT = 6;
const { width } = Dimensions.get("window");
const apiUrl = API_URL;
const STORED_IDENTIFIER = "my-ui";

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const NOTIFICATIONS_API =
  "https://app.nativenotify.com/api/app/indie/sub/16227/F0db46mP8E0ETDYekxQxr0/";

const PinConfirmation = ({ navigation }: Props) => {
  const route = useRoute<RouteParams>();
  const data = route.params;
  const username = data.username;
  const mode = data.mode;
  const codeLenght = 6;
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  const hideLoadingIndicator = () => {
    setLoadingVisible(false);
  };
  const showLoadingIndicator = () => {
    setLoadingVisible(true);
  };

  let screenTitle = "Reset your password";
  let passReset = true;
  if (mode !== "resetPass") {
    screenTitle = "Authentication";
    passReset = false;
  }

  if (!passReset) {
    const navigation2 = useNavigation();
    React.useEffect(() =>
      navigation2.addListener("beforeRemove", (e) => {
        e.preventDefault();
      })
    );
  }

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerify = async () => {
    let code = value;

    if (code.length !== codeLenght) {
      alert("Incomplete code");
      return;
    }

    showLoadingIndicator();
    let fullUrl = `${apiUrl}/users/verifyCodeRecoverPassword`;
    if (!passReset) {
      fullUrl = `${apiUrl}/users/signupconfirm`;
      //post 2fa request
      try {
        const result = await axios.post(fullUrl, {
          username,
          code,
        });

        // Attach token to header
        axios.defaults.headers.common["token"] = `${result.data.token}`;

        try {
          const identifier = await SecureStore.getItemAsync(STORED_IDENTIFIER);
          // Unregister device for notifications'
          if (identifier !== null) {
            await axios.delete(`${NOTIFICATIONS_API}${identifier}`);
          }
        } catch (e) {
          //
        }

        // Store the identifier
        await SecureStore.setItemAsync(STORED_IDENTIFIER, username);

        // Register device to receive notifications
        registerIndieID(username, 16227, "F0db46mP8E0ETDYekxQxr0");

        // estoy en modo offline ya.
        hideLoadingIndicator();
        navigation.navigate("Interests", {
          username: username,
        });
      } catch (e) {
        hideLoadingIndicator();
        alert((e as any).response.data.message);
        return;
      }
    } else {
      // Request for password reset
      try {
        await axios.post(fullUrl, {
          username,
          code,
        });

        hideLoadingIndicator();
        navigation.navigate("ChangePassword", {
          code: code,
          username: username,
        });
      } catch (e) {
        hideLoadingIndicator();
        alert((e as any).response.data.message);
        return;
      }
    }
  };

  const handleResend = async () => {
    showLoadingIndicator();
    try {
      await axios.post(`${apiUrl}/users/recoverPassword`, {
        username,
      });
      hideLoadingIndicator();
      alert("Email sent. Check your inbox");
    } catch (e) {
      hideLoadingIndicator();
      alert((e as any).response.data.message);
    }
  };

  return (
    <View style={styles.root}>
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
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        {screenTitle}
      </Text>
      <Text variant="bodyMedium">
        Check your inbox for an authentication code.
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      {passReset ? (
        <Button
          style={{ width: width * 0.65, marginBottom: 30, borderRadius: 0 }}
          onPress={() => handleResend()}
        >
          Resend Code
        </Button>
      ) : null}

      {/* <Button
        style={{ width: width * 0.65, marginBottom: 30 }}
        onPress={() => handleResend()}
      >
        Resend Code
      </Button> */}

      <Button
        style={styles.button}
        labelStyle={{ color: textLight }}
        mode="contained"
        onPress={() => handleVerify()}
      >
        Verify
      </Button>
    </View>
  );
};

export default PinConfirmation;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: background,
  },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20, marginBottom: 10 },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    textAlign: "center",
    justifyContent: "center",
    margin: 5,
  },
  focusCell: {
    borderColor: "#FFFFFF",
  },
  text: {
    marginBottom: 10,
    fontSize: width * 0.05,
  },
  inputContainer: {
    marginVertical: 10,
    width: width * 0.7,
  },
  button: {
    width: width * 0.7,
    marginVertical: 10,
    backgroundColor: primaryColor,
  },
});
