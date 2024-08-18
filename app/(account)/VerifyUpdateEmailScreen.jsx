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
import { updateEmail, sendMail } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerifyUpdateEmailScreen = () => {
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();

  const headerOptions = HeaderNormal({
    title: "Verify Update Email",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !show) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
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
      const email = await AsyncStorage.getItem("email");
      if (!email) throw new Error("No email found");
      const response = await sendMail(email);
      if (response.status === 200) {
        await AsyncStorage.setItem("otp", response.data.toString());
        setOtpCode("");
        Alert.alert("Success", "OTP sent successfully.");
      } else {
        Alert.alert("Error", "Failed to resend OTP. Please try again later.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to resend OTP. Please try again later."
      );
    }
  };

  const handleVerify = async () => {
    if (!otpCode) {
      Alert.alert("OTP Required", "Please enter the OTP code.");
      return;
    }

    try {
      const storedOTP = await AsyncStorage.getItem("otp");
      if (storedOTP === otpCode) {
        const accountIdString = await AsyncStorage.getItem("accountId");
        const email = await AsyncStorage.getItem("email");

        if (!email || !accountIdString)
          throw new Error("No email or account ID found");

        const accountId = parseInt(accountIdString, 10);
        if (isNaN(accountId)) throw new Error("Invalid account ID");

        const formData = new FormData();
        formData.append("email", email);
        formData.append("accountID", accountId.toString());
        const res = await updateEmail(formData);
        if (res.status === 200) {
          Alert.alert("Success", "Update Email successful!", [
            {
              text: "OK",
              onPress: () => navigation.navigate("AccountProfile"),
            },
          ]);
        } else if (res.status === 208) {
          Alert.alert(
            "Email Mismatch",
            "Email already exists, please enter your email!"
          );
        } else {
          Alert.alert("Error", "Failed to verify OTP. Please try again.");
        }
      } else {
        Alert.alert(
          "Invalid OTP",
          "The OTP code is incorrect. Please click Resend to get a new code."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to verify OTP. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} onTouchStart={Keyboard.dismiss}>
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
              <Text style={[styles.resendText, styles.resendTextActive]}>
                Resend OTP Code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendText}>
              If your email doesn’t have a message, please wait for {countdown}{" "}
              seconds to resend OTP code
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    backgroundColor: "#fff",
    alignItems: "center",
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
  resendTextActive: {
    color: "#00A5F5",
    fontWeight: "bold",
  },
});

export default VerifyUpdateEmailScreen;
