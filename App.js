import StackNavigator from "./StackNavigator";
import { ModalPortal } from "react-native-modals";
import { useEffect, useState } from "react";
import { themeColors } from "./utils/theme/ThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("SplashScreen");

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      const accountId = await AsyncStorage.getItem("accountId");
      const loginTimestamp = await AsyncStorage.getItem("loginTimestamp");

      if (token && accountId && loginTimestamp) {
        const currentTime = Date.now();
        const loginTime = parseInt(loginTimestamp, 10);
        const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;

        if (currentTime - loginTime < thirtyDaysInMilliseconds) {
          setInitialRoute("HomeLayout");
        } else {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("accountId");
          await AsyncStorage.removeItem("loginTimestamp");
          setInitialRoute("SplashScreen");
        }
      } else {
        setInitialRoute("SplashScreen");
      }
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackNavigator initialRouteName={initialRoute} />
      <ModalPortal />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
