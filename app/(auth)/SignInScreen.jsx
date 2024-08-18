import React, { useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { pixelNormalize } from "../../components/Normalize";
import { login } from "./Auth.Api";
import { images } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  const isPhone = /^[0-9]+$/;
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isEmail = (input) => {
    const regexEmail =
      /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    return regexEmail.test(input);
  };

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;
    return passwordRegex.test(password);
  };

  const isPhoneNumber = (input) => {
    const phoneRegex = /^0[3|5|7|8|9]\d{8}$/;
    return phoneRegex.test(input);
  };

  const validateInput = () => {
    if (!input.trim()) {
      Alert.alert("Validation Error", "Email or Phone cannot be empty.");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Validation Error", "Password cannot be empty.");
      return false;
    }
    if (!isNaN(input) && isPhone.test(input)) {
      if (!isPhoneNumber(input)) {
        Alert.alert(
          "Validation Error",
          "Invalid Phone. Example: 03 | 05 | 07 | 08 | 09 xxxxxxxx"
        );
        return false;
      }
    } else if (!isEmail(input)) {
      Alert.alert(
        "Validation Error",
        "Invalid Email. Example: example@gmail.com"
      );
      return false;
    }

    if (!isPasswordValid(password)) {
      Alert.alert(
        "Validation Error",
        "Password must be 8-16 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    try {
      if (!validateInput()) {
        return;
      }

      const loginData = { text: input, password: password };
      const response = await login(loginData);

      if (response && response.data && response.data.success) {
        const userData = response.data.data;
        const token = response.data.token;
        const role = userData.role.name;
        const accountId = String(userData.accountID);
        const hotelId = userData.hotel?.[0]?.hotelID
          ? String(userData.hotel[0].hotelID)
          : null;
        const email = userData.email;
        await AsyncStorage.setItem("role", role);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("accountId", accountId);
        const loginTimestamp = Date.now().toString();
        await AsyncStorage.setItem("loginTimestamp", loginTimestamp);
        if (hotelId) {
          await AsyncStorage.setItem("hotelId", hotelId);
        }
        await AsyncStorage.setItem("email", email);

        switch (role) {
          case "Admin":
            Alert.alert(
              "Access denied",
              "You are not authorized to access as an account administrator"
            );
            break;
          case "Partner":
            Alert.alert(
              "Access denied",
              "You are not allowed to access using the Partner account."
            );
            break;
          case "Customer":
            navigation.reset({
              index: 0,
              routes: [{ name: "HomeLayout" }],
            });
            break;
          default:
            Alert.alert("Unknown Role", "Your role is not recognized.");
            break;
        }
      } else {
        const { status, data } = response?.response || {};
        switch (status) {
          case 404:
            throw new Error("Invalid email/phone or password.");
          case 403:
            if (
              data &&
              data.message === "Your account has been permanently blocked."
            ) {
              Alert.alert(
                "Account Blocked",
                "Your account has been permanently blocked. Please contact support for assistance."
              );
            } else {
              throw new Error("Invalid email/phone or password.");
            }
            break;
          default:
            throw new Error(
              "An error occurred while logging in. Please try again later."
            );
        }
      }
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.signInText}>Sign In</Text>
        </View>
        <View style={styles.signInContainer}>
          <Text style={styles.labelText}>Email or Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your email or phone number"
            value={input}
            onChangeText={setInput}
            keyboardType="default"
          />
          <Text style={styles.labelText}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Please enter your password"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconContainer}
            >
              <Icon
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>Or Login with</Text>
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={() => navigation.navigate("AuthPhone")}
          >
            <Image source={images.phoneicon} style={styles.phoneIcon} />
            <Text style={styles.phoneButtonText}>Phone</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <Text style={styles.signUpButtonText}>Sign Up here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: pixelNormalize(10),
    paddingTop: pixelNormalize(50),
    backgroundColor: "#75D4FF",
  },
  headerContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: pixelNormalize(10),
    marginBottom: pixelNormalize(10),
  },
  logo: {
    width: pixelNormalize(100),
    height: pixelNormalize(100),
    marginBottom: pixelNormalize(10),
  },
  signInText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
    textAlign: "left",
  },
  signInContainer: {
    width: "100%",
    maxWidth: pixelNormalize(400),
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  labelText: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontSize: pixelNormalize(16),
    marginBottom: pixelNormalize(10),
    color: "#000",
  },
  input: {
    width: "100%",
    padding: pixelNormalize(10),
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: pixelNormalize(5),
    marginBottom: pixelNormalize(20),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: pixelNormalize(5),
    marginBottom: pixelNormalize(20),
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    padding: pixelNormalize(10),
  },
  iconContainer: {
    position: "absolute",
    right: pixelNormalize(10),
    padding: pixelNormalize(10),
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: pixelNormalize(20),
  },
  forgotPasswordText: {
    color: "#F14542",
    fontWeight: "bold",
    fontSize: pixelNormalize(16),
  },
  signInButton: {
    width: "100%",
    padding: pixelNormalize(18),
    backgroundColor: "#09AAEE",
    borderRadius: pixelNormalize(5),
    alignItems: "center",
    marginBottom: pixelNormalize(10),
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: pixelNormalize(17),
    fontWeight: "bold",
  },
  orText: {
    marginTop: 5,
    fontSize: pixelNormalize(16),
    color: "#A9A9A9",
    marginBottom: pixelNormalize(20),
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: pixelNormalize(15),
    borderColor: "#00A5F5",
    borderWidth: 1,
    borderRadius: pixelNormalize(5),
    justifyContent: "center",
    marginBottom: pixelNormalize(20),
  },
  googleIcon: {
    marginRight: pixelNormalize(10),
    width: pixelNormalize(30),
    height: pixelNormalize(30),
  },
  googleButtonText: {
    color: "#00A5F5",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: pixelNormalize(15),
    borderColor: "#00A5F5",
    borderWidth: 1,
    borderRadius: pixelNormalize(5),
    justifyContent: "center",
    marginBottom: pixelNormalize(20),
  },
  phoneIcon: {
    marginRight: pixelNormalize(10),
    width: pixelNormalize(30),
    height: pixelNormalize(30),
  },
  phoneButtonText: {
    color: "#00A5F5",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signUpText: {
    fontSize: pixelNormalize(16),
    color: "#000",
  },
  signUpButtonText: {
    fontSize: pixelNormalize(16),
    color: "#042F4D",
    marginLeft: pixelNormalize(5),
    fontWeight: "bold",
  },
});

export default SignInScreen;
