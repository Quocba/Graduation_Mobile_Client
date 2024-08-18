import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import HeaderNormal from "../../components/HeaderNormal";
import { useNavigation } from "@react-navigation/native";
import { getAllVoucherByAccountId } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_IMAGE } from "../../services/ApiUrl";

const MyVoucherPage = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "My Voucher",
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const handleNavigateToVouchers = (voucherData) => {
    navigation.navigate("ModelViewMyVouchers", { voucherData });
  };

  const [activeFilter, setActiveFilter] = useState("all");
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      const res = await getAllVoucherByAccountId(accountId);

      if (res && res.length > 0) {
        setVouchers(res);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Unauthorized. Redirecting to login...");
      } else {
        setError("Error fetching profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const getFilteredVouchers = () => {
    if (activeFilter === "all") {
      return vouchers;
    } else if (activeFilter === "unused") {
      return vouchers.filter((voucher) => voucher.isVoucher);
    } else if (activeFilter === "used") {
      return vouchers.filter((voucher) => !voucher.isVoucher);
    }
    return vouchers;
  };

  const renderVoucherItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.voucherItem,
        { marginBottom: 10 },
        !item.isVoucher && styles.usedVoucherItem,
      ]}
      onPress={() => handleNavigateToVouchers(item)}
    >
      <View style={styles.voucherImageContainer}>
        <Image
          source={{ uri: `${URL_IMAGE}${item?.voucher?.voucherImage}` }}
          style={styles.voucherImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.voucherInfo}>
        <Text style={styles.voucherTitle}>{item?.voucher?.voucherName}</Text>
        <Text
          style={styles.voucherDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.voucher?.description}
        </Text>
        <View style={styles.viewContainer}>
          <View style={styles.voucherCodeContainer}>
            <Text style={styles.voucherCode}>{item?.voucher?.code}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleNavigateToVouchers(item)}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const sortedVouchers = getFilteredVouchers().sort((a, b) => {
    if (!a.isVoucher && b.isVoucher) return 1;
    if (a.isVoucher && !b.isVoucher) return -1;
    return 0;
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollMyVoucher}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === "all" && styles.activeFilter,
              ]}
              onPress={() => handleFilterChange("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "all" && styles.activeFilterText,
                ]}
              >
                All Vouchers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === "unused" && styles.activeFilter,
              ]}
              onPress={() => handleFilterChange("unused")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "unused" && styles.activeFilterText,
                ]}
              >
                Vouchers Unused
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === "used" && styles.activeFilter,
              ]}
              onPress={() => handleFilterChange("used")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "used" && styles.activeFilterText,
                ]}
              >
                Vouchers Used
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {loading ? (
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text>Loading vouchers...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : error ? (
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text>{error}</Text>
          </View>
        ) : vouchers.length === 0 ? (
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text>No vouchers available</Text>
          </View>
        ) : (
          <FlatList
            data={sortedVouchers}
            renderItem={renderVoucherItem}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            contentContainerStyle={styles.vouchersList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 10,
  },
  filterContainer: {
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    elevation: 5,
  },
  filterScrollMyVoucher: {
    paddingHorizontal: 10,
  },
  filterButton: {
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  activeFilter: {
    borderBottomWidth: 2,
    borderBottomColor: "#00A5F5",
  },
  activeFilterText: {
    color: "#00A5F5",
  },
  vouchersList: {
    flexGrow: 1,
  },
  voucherItem: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  usedVoucherItem: {
    backgroundColor: "#D9D9D9",
    borderBottomColor: "00A5F5",
  },
  voucherImageContainer: {
    marginRight: 15,
    paddingTop: 5,
  },
  voucherImage: {
    width: 160,
    height: 100,
    borderRadius: 10,
  },
  voucherInfo: {
    flex: 1,
    justifyContent: "center",
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  voucherDescription: {
    fontSize: 16,
    marginTop: 5,
    color: "#A9A9A9",
    marginBottom: 10,
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewButton: {
    backgroundColor: "#028AE0",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  voucherCodeContainer: {
    backgroundColor: "#028AE0",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  voucherCode: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MyVoucherPage;
