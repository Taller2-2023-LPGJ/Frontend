import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Logo from "../../components/Logo";
import { Button } from "react-native-paper";

const CELL_COUNT = 6;
const { width } = Dimensions.get("window");

const PinConfirmation = () => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View style={styles.root}>
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        Authentication
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
        style={{ width: width * 0.65, marginBottom: 40 }}
        onPress={() => console.log("Resend code")}
      >
        Resend Code
      </Button>

      <Button
        style={{ width: width * 0.65, marginVertical: 10 }}
        mode="contained"
        onPress={() => console.log(`Verify code: ${value}`)}
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
});
