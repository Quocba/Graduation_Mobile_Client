import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import { images } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { pixelNormalize } from "../../components/Normalize";
import { resetPassword } from "./Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "Reset Password",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleResetPass = async () => {
    if (newPassword === "" || confirmPassword === "") {
      Alert.alert(
        "Password Required",
        "Please enter new password and confirm password."
      );
    } else if (
      !regexPassword.test(newPassword) ||
      !regexPassword.test(confirmPassword)
    ) {
      Alert.alert(
        "Invalid Password",
        "Password must be 8-16 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character."
      );
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      Alert.alert(
        "Passwords Mismatch",
        "Confirm password is not equal to password!"
      );
    } else {
      try {
        let formData = new FormData();
        formData.append("email", await AsyncStorage.getItem("email"));
        formData.append("newPassword", confirmPassword);

        const response = await resetPassword(formData);

        if (response.status === 200) {
          AsyncStorage.clear();
          Alert.alert("Success", "Password reset successfully.");
          navigation.navigate("SignInScreen");
        } else {
          Alert.alert(
            "Error",
            "Failed to reset password. Please try again later."
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to reset password. Please try again later."
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          />
          <Text style={styles.resetPasswordText}>Reset Password</Text>
        </View>
        <View style={styles.resetPasswordContainer}>
          <Text style={styles.descriptionText}>
            Please enter your new password below
          </Text>
          <Text style={styles.labelText}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Please enter new password"
              secureTextEntry={!isNewPasswordVisible}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={toggleNewPasswordVisibility}
              style={styles.iconContainer}
            >
              <Icon
                name={isNewPasswordVisible ? "eye-off" : "eye"}
                size={pixelNormalize(20)}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.labelText}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Please enter again password"
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
                size={pixelNormalize(20)}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleResetPass}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  containerHeader: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: pixelNormalize(10),
  },
  resetPasswordContainer: {
    width: "100%",
    maxWidth: pixelNormalize(400),
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: pixelNormalize(100),
    height: pixelNormalize(100),
  },
  resetPasswordText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
    marginBottom: pixelNormalize(20),
    textAlign: "center",
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
  confirmButton: {
    width: "100%",
    padding: pixelNormalize(15),
    backgroundColor: "#028AE0",
    borderRadius: pixelNormalize(5),
    alignItems: "center",
    marginTop: pixelNormalize(10),
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;
