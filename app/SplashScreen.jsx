import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images } from "../constants";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View>
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-full h-40"
          />
          <Image
            source={images.thumbnail}
            resizeMode="contain"
            className="w-full h-[350px]"
          />

          <View className="mt-5">
            <Text className="text-3xl text-white font-semibold text-center">
              Discover Famous Hotels with{" "}
              <Text className="text-secondary-600">Eposh</Text>
            </Text>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("SignInScreen")}
            >
              <Text style={styles.buttonText}>Let's Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#75D4FF",
  },

  logo: {
    width: "100%",
    height: 160,
  },
  thumbnail: {
    width: "100%",
    height: 350,
  },
  textView: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 28,
    width: 300,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  highlightText: {
    color: "#0270C7",
    textTransform: "uppercase",
  },
  buttonView: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#09AAEE",
    paddingVertical: 20,
    paddingHorizontal: 120,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SplashScreen;
