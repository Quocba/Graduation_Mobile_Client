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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { images } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import HeaderNormal from "../../components/HeaderNormal";
import { useNavigation } from "@react-navigation/native";
import { pixelNormalize } from "../../components/Normalize";
import { registerCustomer } from "./Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "Sign Up",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const regexPhone = /^0[3|5|7|8|9]\d{8}$/;
  const regexEmail =
    /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSignUp = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      phone === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      Alert.alert("Error", "All fields are required!");
    } else {
      if (!regexPhone.test(phone)) {
        Alert.alert(
          "Invalid Phone",
          "Example: 03 | 05 | 07 | 08 | 09 xxxxxxxx"
        );
      } else if (!regexEmail.test(email)) {
        Alert.alert(
          "Invalid Email",
          "Invalid email address, Example: example@gmail.com"
        );
      } else if (!regexPassword.test(password)) {
        Alert.alert(
          "Error",
          "New password must be 8-16 characters long and include uppercase, lowercase, number, and special character!"
        );
      } else if (password !== confirmPassword) {
        Alert.alert("Error", "Confirm password is not equal to password!");
      } else if (firstName.trim().length > 16) {
        Alert.alert("Error", "First name cannot be more than 16 characters!");
      } else if (lastName.trim().length > 16) {
        Alert.alert("Error", "Last name cannot be more than 16 characters!");
      } else {
        const data = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password: password.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`,
        };
        try {
          setDisableButton(true);
          const res = await registerCustomer(data);
          if (res.status === 200) {
            Alert.alert(
              "Success",
              "Registration successful! Redirecting to verification screen."
            );
            await AsyncStorage.setItem("email", res.data.data?.account?.email);
            await AsyncStorage.setItem("otp", res.data.data?.otp);

            setTimeout(() => {
              navigation.navigate("VerifyOTP");
            }, 2000);
          } else if (res.status === 208) {
            if (res.data.message === "Email is already exists. Please login!") {
              Alert.alert("Error", "Email is already exists. Please login!");
            } else if (res.data.message === "Phone is already exists. Please login!") {
              Alert.alert("Error", "Phone is already exists. Please login!");
            } else {
              Alert.alert("Error", "An error occurred. Please try again.");
            }
          } else {
            Alert.alert("Error", "An error occurred. Please try again.");
          }
        } catch (error) {
          Alert.alert("Error", "An error occurred. Please try again.");
        } finally {
          setDisableButton(false);
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={images.logo}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.signUpText}>Sign Up</Text>
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.labelText}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter your first name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <Text style={styles.labelText}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter your last name"
              value={lastName}
              onChangeText={setLastName}
            />
            <Text style={styles.labelText}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Text style={styles.labelText}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Please enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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
            <Text style={styles.labelText}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Please confirm your password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                style={styles.iconContainer}
              >
                <Icon
                  name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={disableButton}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignInScreen")}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  signUpText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
    color: "#000",
  },
  signUpContainer: {
    width: "100%",
    maxWidth: pixelNormalize(400),
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: pixelNormalize(20),
  },
  labelText: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontSize: pixelNormalize(16),
    marginBottom: pixelNormalize(5),
    color: "#000",
  },
  input: {
    width: "100%",
    padding: pixelNormalize(10),
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: pixelNormalize(5),
    marginBottom: pixelNormalize(15),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: pixelNormalize(5),
    marginBottom: pixelNormalize(15),
  },
  passwordInput: {
    flex: 1,
    padding: pixelNormalize(10),
  },
  iconContainer: {
    padding: pixelNormalize(10),
  },
  signUpButton: {
    width: "100%",
    padding: pixelNormalize(15),
    backgroundColor: "#09AAEE",
    borderRadius: pixelNormalize(5),
    alignItems: "center",
    marginBottom: pixelNormalize(20),
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInText: {
    fontSize: pixelNormalize(16),
    color: "#000",
  },
  signInButtonText: {
    fontSize: pixelNormalize(16),
    color: "#042F4D",
    marginLeft: pixelNormalize(5),
    fontWeight: "bold",
  },
});

export default SignUpScreen;
