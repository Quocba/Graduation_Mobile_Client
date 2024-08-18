import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import { images } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { pixelNormalize } from "../../components/Normalize";
import { sendMail } from "./Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "Forgot Password",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [email, setEmail] = useState("");

  const isEmailValid = (input) => {
    const emailRegex =
      /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    return emailRegex.test(input);
  };

  const handleSend = async () => {
    if (email === "") {
      Alert.alert("Email Required", "Please enter your email.");
    } else {
      if (!isEmailValid(email)) {
        Alert.alert(
          "Invalid Email",
          "Invalid email address, Example: example@gmail.com"
        );
      } else {
        try {
          const res = await sendMail(email);

          if (res.status === 200) {
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("otp", JSON.stringify(res?.data));
            Alert.alert(
              "Success",
              "Forgot Password successful! Redirecting to verification screen.",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("VerifyEmailScreen"),
                },
              ]
            );
          } else {
            Alert.alert("Error", "Failed to send OTP. Please try again later.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to send OTP. Please try again later.");
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.descriptionText}>
            To reset your password, please enter the registered email address
            and we'll send you OTP in your email!
          </Text>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: pixelNormalize(10),
    backgroundColor: "#75D4FF",
  },
  headerContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: pixelNormalize(20),
    paddingLeft: pixelNormalize(10),
  },
  logo: {
    width: pixelNormalize(100),
    height: pixelNormalize(100),
  },
  forgotPasswordText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
  },
  forgotPasswordContainer: {
    width: "100%",
    maxWidth: pixelNormalize(400),
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  descriptionText: {
    fontSize: pixelNormalize(15),
    color: "#A9A9A9",
    marginBottom: pixelNormalize(20),
    textAlign: "center",
  },
  labelText: {
    alignSelf: "flex-start",
    fontSize: pixelNormalize(16),
    color: "#000",
    marginBottom: pixelNormalize(10),
  },
  input: {
    width: "100%",
    padding: pixelNormalize(10),
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: pixelNormalize(5),
    marginBottom: pixelNormalize(20),
  },
  sendButton: {
    width: "100%",
    padding: pixelNormalize(15),
    backgroundColor: "#09AAEE",
    borderRadius: pixelNormalize(5),
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
