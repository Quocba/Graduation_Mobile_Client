import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ModalLogout from "./Modal/ModalLogout";
import { getProfile } from "../(auth)/Auth.Api";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_IMAGE } from "../../services/ApiUrl";
import { LinearGradient } from "expo-linear-gradient";

const AccountLayout = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      const res = await getProfile(accountId);

      if (res) {
        setData(res);
      } else {
        console.error("Error fetching profile: Data not found");
        setError("Error fetching profile: Data not found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
      } else {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setError(null);
      fetchUserProfile();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  const handleNavigateToProfile = () => {
    navigation.navigate("AccountProfile");
  };

  const handleNavigateToVouchers = () => {
    navigation.navigate("MyVoucherPage");
  };

  const handleNavigateToPosts = () => {
    navigation.navigate("MyPostsPage");
  };

  const handleNavigateToMyBookings = () => {
    navigation.navigate("MyBookingsPage");
  };
  const handleNavigateToTermOfService = () => {
    navigation.navigate("TermsOfService");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accountId");
      setLogoutModalVisible(false);
      navigation.navigate("SplashScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <LinearGradient colors={["#00A5F5", "#75D4FF"]} style={styles.header}>
        <Image
          source={
            data?.profile?.avatar?.startsWith("/", 0)
              ? { uri: `${URL_IMAGE}${data?.profile?.avatar}` }
              : data?.profile?.avatar?.includes("https")
              ? { uri: `${data?.profile?.avatar}` }
              : require("../../assets/logo.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">
          {data?.profile?.fullName}
        </Text>
      </LinearGradient>
      <View style={styles.container}>
        <View style={styles.allMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToProfile}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="person-outline"
                size={30}
                color="#75D4FF"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToMyBookings}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="calendar-outline"
                size={30}
                color="#75D4FF"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>My Bookings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNavigateToPosts}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="document-text-outline"
                size={30}
                color="#75D4FF"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>My Posts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItemVoucher}
            onPress={handleNavigateToVouchers}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="pricetag-outline"
                size={30}
                color="#75D4FF"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>My Vouchers</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#000000" />
          </TouchableOpacity>
        </View>

        <View style={styles.termsMenu}>
          <TouchableOpacity style={styles.menuItemVoucher} onPress={handleNavigateToTermOfService}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="document-outline"
                size={30}
                color="#75D4FF"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutMenu}>
          <TouchableOpacity
            style={styles.menuItemVoucher}
            onPress={() => setLogoutModalVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="log-out-outline"
                size={30}
                color="#75D4FF"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ModalLogout
          isVisible={isLogoutModalVisible}
          onClose={() => setLogoutModalVisible(false)}
          onLogout={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  container: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: "100%",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 20,
  },
  memberName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  allMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItemVoucher: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  termsMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AccountLayout;
