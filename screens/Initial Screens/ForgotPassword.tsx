import { Dimensions, StyleSheet, View } from 'react-native'
import React from 'react'
import { Navigation } from '../../types/types';
import { TextInput,Text, Button } from 'react-native-paper';
import Logo from '../../components/Logo';

type Props = {
  navigation: Navigation;
};

const { width } = Dimensions.get("window");

const ForgotPassword = ({ navigation }: Props) => {

  const [mail, setMail] = React.useState("");

  function handleForgotPassword() {
    
    if (mail === "") {
      alert("Empty input fields");
    } else {
      // password reset request
      console.log(`sending password reset instructions to: ${mail}`);
      navigation.navigate("StartScreen");
    }

  }
  
  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.text} variant="headlineMedium">
        Restore Password
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={mail}
          mode="outlined"
          style={{ marginBottom: 10 }}
          onChangeText={(mail) => setMail(mail)}
        />
        
      </View>

      <Button
        style={{ width: width * 0.65, marginVertical: 10 }}
        mode="contained"
        onPress={() => handleForgotPassword()}
      >
        Send Instructions
      </Button>

    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 10,
    fontSize:width*0.05
  },
  inputContainer: {
    marginVertical: 10,
    width: width * 0.7,
  },
});
