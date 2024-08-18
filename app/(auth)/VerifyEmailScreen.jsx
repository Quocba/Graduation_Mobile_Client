import React, { useState, useEffect, useLayoutEffect } from "react";
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
import { sendMail, verifyEmail } from "./Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerifyEmailScreen = () => {
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();

  const headerOptions = HeaderNormal({
    title: "Verify Email",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  useEffect(() => {
    let timer;

    if (countdown > 0 && !show) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !show) {
      AsyncStorage.removeItem("otp");
      setShow(true);
    }

    return () => clearTimeout(timer);
  }, [countdown, show]);

  const handleResendOTP = async () => {
    try {
      setCountdown(60);
      setShow(false);
      const response = await sendMail(await AsyncStorage.getItem("email"));
      if (response.status === 200) {
        await AsyncStorage.setItem("otp", response.data.toString());
        Alert.alert("Success", "OTP sent successfully.");
      } else {
        Alert.alert("Error", "Failed to resend OTP. Please try again later.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again later.");
    }
  };

  const handleVerify = async () => {
    if (otpCode === "") {
      Alert.alert("OTP Required", "Please enter OTP code.");
    } else {
      try {
        const storedOTP = await AsyncStorage.getItem("otp");
        if (storedOTP && storedOTP.toString() === otpCode) {
          let formData = new FormData();
          formData.append("email", await AsyncStorage.getItem("email"));

          const res = await verifyEmail(formData);
          if (res.status === 200) {
            navigation.navigate("ResetPasswordScreen");
          } else {
            Alert.alert("Error", "Failed to verify OTP. Please try again.");
          }
        } else {
          Alert.alert(
            "Invalid OTP",
            "Old or invalid OTP code, please click Resend!"
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to verify OTP. Please try again later.");
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
          <Text style={styles.verifyEmailText}>VERIFY YOUR EMAIL</Text>
        </View>
        <View style={styles.verifyContainer}>
          <Text style={styles.descriptionText}>
            OTP Code has been sent to your email. Please enter it to verify!
          </Text>
          <Text style={styles.labelText}>OTP Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP code"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleVerify}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          {countdown === 0 ? (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text
                style={[
                  styles.resendText,
                  { color: "#00A5F5", fontWeight: "bold" },
                ]}
              >
                Resend OTP Code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.resendText, { color: "#A9A9A9" }]}>
              If your email doesn’t have a message, please wait for{" "}
              {countdown} seconds to resend OTP code
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: pixelNormalize(10),
  },
  verifyEmailText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
    color: "#000",
  },
  verifyContainer: {
    width: "100%",
    maxWidth: pixelNormalize(400),
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  descriptionText: {
    fontSize: pixelNormalize(16),
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
    borderRadius: pixelNormalize(10),
    marginBottom: pixelNormalize(20),
  },
  continueButton: {
    width: "100%",
    padding: pixelNormalize(15),
    backgroundColor: "#09AAEE",
    borderRadius: pixelNormalize(5),
    alignItems: "center",
    marginBottom: pixelNormalize(20),
  },
  continueButtonText: {
    color: "#fff",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
  resendText: {
    fontSize: pixelNormalize(15),
    textAlign: "center",
  },
});

export default VerifyEmailScreen;
