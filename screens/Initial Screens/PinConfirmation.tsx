import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { API_URL } from "@env";
import axios from "axios";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Logo from "../../components/Logo";
import { Button } from "react-native-paper";
import { Navigation } from "../../types/types";
import { useRoute } from "@react-navigation/native";

const CELL_COUNT = 6;
const { width } = Dimensions.get("window");
const apiUrl = API_URL;

type Props = {
  navigation: Navigation;
};

type RouteParams = {
  params: any;
  key: string;
  name: string;
  path?: string | undefined;
};

const PinConfirmation = ({ navigation }: Props) => {
  const route = useRoute<RouteParams>();
  const data = route.params;
  const username = data.username;
  const mode = data.mode;
  const codeLenght = 6;

  let screenTitle = "Reset your password";
  let passReset = true;
  if (mode !== "resetPass") {
    screenTitle = "Authentication";
    passReset = false;
  }

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleVerify = async () => {
    let code = value;
    console.log(`code length: ${code}`);

    if (code.length !== codeLenght) {
      alert("Incomplete code");
      return;
    }

    let fullUrl = `${apiUrl}/verifyCodeRecoverPassword`;
    if (!passReset) {
      fullUrl = `${apiUrl}/2fa`;
      //post 2fa request
      console.log(`2FA log attempt `);
      /*
      try catch...
      */
      navigation.navigate("Interests");
    } else {
      // Request for password reset
      try {
        await axios.post(fullUrl, {
          username,
          code,
        });

        navigation.navigate("ChangePassword", {
          code: code,
          username: username,
        });
      } catch (e) {
        alert((e as any).response.data.message);
      }
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${apiUrl}/recoverPassword`, {
        username,
      });
      alert("Email sent. Check your inbox");
    } catch (e) {
      alert((e as any).response.data.message);
    }
  };

  return (
    <View style={styles.root}>
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
      <Button
        style={{ width: width * 0.65, marginBottom: 30 }}
        onPress={() => handleResend()}
      >
        Resend Code
      </Button>

      <Button
        style={{ width: width * 0.65, marginVertical: 10 }}
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
  },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20, marginBottom: 10 },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    justifyContent: "center",
    margin: 5,
  },
  focusCell: {
    borderColor: "#000",
  },
  text: {
    marginBottom: 10,
    fontSize: width * 0.05,
  },
  inputContainer: {
    marginVertical: 10,
    width: width * 0.7,
  },
});
