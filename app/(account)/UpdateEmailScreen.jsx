import React, { useState, useLayoutEffect, useEffect, useCallback } from "react";
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
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { pixelNormalize } from "../../components/Normalize";
import { sendMail } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentEmail } = route.params;
  const headerOptions = HeaderNormal({
    title: "Update Email",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(currentEmail || "");
  }, [currentEmail]);

  useFocusEffect(
    useCallback(() => {
      setEmail("");
    }, [])
  );
  
  const isEmailValid = (input) => {
    const emailRegex =
      /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    return emailRegex.test(input);
  };
  
  const handleUpdate = async () => {
    if (email === "") {
      Alert.alert("Email Required", "Please enter your new email.");
    }else if (email === currentEmail) {
        Alert.alert("Email Unchanged", "The new email address is the same as the old one.");
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
            setEmail(""); 
            Alert.alert(
              "Success",
              "Please check your email for the OTP code.",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("VerifyUpdateEmailScreen"),
                },
              ]
            );
          } else {
            Alert.alert("Error", "Failed to update email. Please try again later.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to update email. Please try again later.");
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
          <Text style={styles.updateEmailText}>Update Email</Text>
        </View>
        <View style={styles.updateEmailContainer}>
          <Text style={styles.descriptionText}>
            To update your email, please enter the new email address and we’ll save it for you!
          </Text>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your new email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
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
  updateEmailText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
  },
  updateEmailContainer: {
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
  updateButton: {
    width: "100%",
    padding: pixelNormalize(15),
    backgroundColor: "#09AAEE",
    borderRadius: pixelNormalize(5),
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
  },
});

export default UpdateEmailScreen;