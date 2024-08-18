import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { pixelNormalize } from "../../components/Normalize";
import { sendMail } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdatePhoneScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentPhone, currentEmail } = route.params;
  const headerOptions = HeaderNormal({
    title: "Update Phone",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setPhone(reversePhoneNumber(currentPhone) || "");
      } catch (error) {
        Alert.alert("Error", "Error fetching user profile: " + error.message);
      }
    };
    fetchProfile();
  }, [currentPhone]);

  useFocusEffect(
    useCallback(() => {
      setPhone("");
    }, [])
  );

  const formatPhoneNumber = (number) => {
    if (number && number.startsWith("0")) {
      return "+84" + number.slice(1);
    }
    return number;
  };

  const reversePhoneNumber = (number) => {
    if (number && number.startsWith("+84")) {
      return "0" + number.slice(3);
    }
    return number;
  };

  const isPhoneValid = (number) => {
    const phoneRegex = /^\+84\d{9}$/;
    return phoneRegex.test(number);
  };

  const isFormattedPhoneNumber = (number) => {
    return typeof number === "string" && number.startsWith("+");
  };

  const handleUpdate = async () => {
    if (phone === "") {
      Alert.alert("Error", "Please enter a new phone number.");
    } else if (phone === currentPhone) {
      Alert.alert(
        "Error",
        "Please enter a new phone number different from the current one."
      );
    } else {
      const formattedPhone = formatPhoneNumber(phone);

      if (!formattedPhone || !isFormattedPhoneNumber(formattedPhone)) {
        Alert.alert(
          "Invalid phone number format",
          "Phone number must be in E.164 format (e.g., +8434567890)."
        );
        return;
      }

      if (!isPhoneValid(formattedPhone)) {
        Alert.alert(
          "Invalid Phone Number",
          "Please enter a valid phone number in E.164 format."
        );
        return;
      }

      try {
        const res = await sendMail(currentEmail);
        if (res.status === 200) {
          const localPhone = reversePhoneNumber(formattedPhone);
          await AsyncStorage.setItem("phone", localPhone);
          await AsyncStorage.setItem("otp", JSON.stringify(res?.data));
          await AsyncStorage.setItem("email", currentEmail);
          setPhone("");
          Alert.alert("Success", "Please check your email for the OTP code.", [
            {
              text: "OK",
              onPress: () => navigation.navigate("VerifyUpdatePhoneScreen"),
            },
          ]);
        } else {
          Alert.alert(
            "Error",
            "Failed to update phone. Please try again later."
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update phone. Please try again later.");
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
          <Text style={styles.updatePhoneText}>Update Phone</Text>
        </View>
        <View style={styles.updatePhoneContainer}>
          <Text style={styles.descriptionText}>
            To update your phone number, please enter the new number. We’ll send
            the OTP to your email!
          </Text>
          <Text style={styles.labelText}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your new phone number"
            value={phone}
            onChangeText={(phone) => setPhone(formatPhoneNumber(phone))}
            keyboardType="phone-pad"
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
  updatePhoneText: {
    fontSize: pixelNormalize(32),
    fontWeight: "bold",
  },
  updatePhoneContainer: {
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

export default UpdatePhoneScreen;
