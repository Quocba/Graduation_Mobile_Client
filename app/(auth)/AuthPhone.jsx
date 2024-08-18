import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { images } from "../../constants";
import { themeColors } from "../../utils/theme/ThemeColor";
import auth from "@react-native-firebase/auth";
import { pixelNormalize } from "../../components/Normalize";
import { loginPhone } from "./Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDate } from "date-fns";

const AuthPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
  const navigation = useNavigation();

  const isValidPhoneNumber = (number) => {
    const phoneRegex = /^\+84\d{9}$/;
    return phoneRegex.test(number);
  };

  const isFormattedPhoneNumber = (number) => {
    return typeof number === "string" && number.startsWith("+");
  };

  const formatPhoneNumber = (number) => {
    if (number.startsWith("0")) {
      return "+84" + number.slice(1);
    }
    return number;
  };

  const reversePhoneNumber = (number) => {
    if (number.startsWith("+84")) {
      return "0" + number.slice(3);
    }
    return number;
  };

  const signInWithPhoneNumber = async () => {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (
      !formattedPhoneNumber ||
      !isFormattedPhoneNumber(formattedPhoneNumber)
    ) {
      Alert.alert(
        "Invalid phone number format",
        "Phone number must be in E.164 format (e.g., +1234567890)."
      );
      return;
    }

    if (!isValidPhoneNumber(formattedPhoneNumber)) {
      Alert.alert(
        "Invalid phone number",
        "Please enter a valid phone number in E.164 format."
      );
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(
        formattedPhoneNumber
      );
      setFormattedPhoneNumber(formattedPhoneNumber);
      setConfirm(confirmation);
      setResendTimeout(60); // Start the countdown when OTP is first sent
    } catch (error) {
      console.log("Error sending code: ", error);
    }
  };

  const confirmCode = async () => {
    try {
      if (confirm) {
        const userCredential = await confirm.confirm(code);
        const user = userCredential.user;

        if (!userCredential || !user) {
          Alert.alert(
            "Error",
            "Failed to confirm user. Invalid user credential."
          );
          return;
        } else {
          let formData = new FormData();
          const currentDate = new Date();

          formData.append("phone", reversePhoneNumber(user.phoneNumber));
          formData.append("avatar", null);
          formData.append("userName", null);
          formData.append("birthDay", formatDate(currentDate, "yyyy/MM/dd"));
          formData.append("Gender", null);
          formData.append("address", null);
          formData.append("email", null);

          const res = await loginPhone(formData);

          if (res.status === 200) {
            await AsyncStorage.setItem(
              "accountId",
              res.data?.data?.accountID?.toString() || ""
            );
            await AsyncStorage.setItem(
              "role",
              res.data?.data?.role?.name || ""
            );
            await AsyncStorage.setItem("token", res.data?.token || "");

            const loginTimestamp = Date.now().toString();
            await AsyncStorage.setItem("loginTimestamp", loginTimestamp);
            Alert.alert("Success", "Login with Phone successfully !");
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "HomeLayout" }],
              });
            }, 2000);
          } else {
            Alert.alert("Error", "Login with Phone failed !");
          }
        }
      } else {
        Alert.alert("Don't verify your phone number");
      }
    } catch (error) {
      Alert.alert("Invalid OTP code", error.message);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimeout > 0) return;

    try {
      const confirmation = await auth().signInWithPhoneNumber(
        formattedPhoneNumber
      );
      setConfirm(confirmation);
      setCode("");
      setResendTimeout(60); // Reset the countdown
    } catch (error) {
      console.log("Error resending code: ", error);
    }
  };

  const header = HeaderNormal({
    title: "Login With Phone",
    navigation: navigation,
  }).setHeaderOptions;

  useEffect(() => {
    let intervalId;
    if (resendTimeout > 0) {
      intervalId = setInterval(() => {
        setResendTimeout((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [resendTimeout]);

  useLayoutEffect(() => {
    navigation.setOptions(header());
  }, [navigation]);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.bgSplashScreen }}
    >
      {!confirm ? (
        <View
          style={{
            paddingHorizontal: 12,
            flex: 1,
            justifyContent: "center",
            gap: 25,
          }}
        >
          <View style={{ gap: 8 }}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={{
                width: pixelNormalize(100),
                height: pixelNormalize(100),
                marginBottom: pixelNormalize(10),
              }}
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: themeColors.black,
              }}
            >
              Phone Number Authentication
            </Text>
          </View>
          <View
            style={{
              backgroundColor: themeColors.white,
              paddingHorizontal: 12,
              paddingVertical: 15,
              borderRadius: 8,
              elevation: 4,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 20,
                color: themeColors.black,
              }}
            >
              Enter your phone number:
            </Text>

            <TextInput
              style={{
                height: 50,
                width: "100%",
                borderColor: themeColors.black,
                borderWidth: 1,
                marginBottom: 20,
                paddingHorizontal: 10,
                borderRadius: 10,
                fontSize: 15,
              }}
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={(number) =>
                setPhoneNumber(formatPhoneNumber(number))
              }
              placeholder="e.g., +123456789"
            />

            <TouchableOpacity
              onPress={signInWithPhoneNumber}
              style={{
                backgroundColor: themeColors.primary_Default,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: themeColors.white,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Send Code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: 12,
            flex: 1,
            justifyContent: "center",
            gap: 25,
          }}
        >
          <View style={{ gap: 8 }}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={{
                width: pixelNormalize(100),
                height: pixelNormalize(100),
                marginBottom: pixelNormalize(10),
              }}
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                color: themeColors.black,
              }}
            >
              Verify Phone
            </Text>
          </View>
          <View
            style={{
              backgroundColor: themeColors.white,
              paddingHorizontal: 12,
              paddingVertical: 15,
              borderRadius: 8,
              elevation: 4,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: themeColors.gray,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              OTP Code has been sent to your SMS. Please enter it to verify!
            </Text>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 10,
                color: themeColors.black,
              }}
            >
              OTP Code
            </Text>
            <TextInput
              style={{
                height: 50,
                width: "100%",
                borderColor: themeColors.black,
                borderWidth: 1,
                marginBottom: 20,
                paddingHorizontal: 10,
                borderRadius: 10,
                fontSize: 15,
              }}
              placeholder="Enter OTP code"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{
                backgroundColor: themeColors.primary_Default,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                marginBottom: 10,
              }}
              onPress={confirmCode}
            >
              <Text
                style={{
                  color: themeColors.white,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Confirm Code
              </Text>
            </TouchableOpacity>
            {resendTimeout > 0 ? (
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  color: themeColors.gray,
                }}
              >
                If your email or sms don’t have a message, please wait for{" "}
                <Text style={{ color: themeColors.title }}>
                  {resendTimeout}
                </Text>{" "}
                seconds to resend OTP code
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    color: themeColors.text_Link,
                  }}
                >
                  Resend OTP Code
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AuthPhone;
