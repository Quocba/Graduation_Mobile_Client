import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { images } from "../../constants";
import { pixelNormalize } from "../../components/Normalize";
import { getAllVoucher, receiveVoucher } from "./VouchersLayout.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderLogoTitle } from "../../components/HeaderLogoAndTitle";

const VouchersLayout = ({ navigation }) => {
  const [hotelVoucher, setVoucherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const header = HeaderLogoTitle(images.logo);
  const pollInterval = 1000;

  useLayoutEffect(() => {
    navigation.setOptions(header.headerOptions);
  }, [navigation]);

  const splitIntoRows = (data, numColumns) => {
    const rows = [];
    for (let i = 0; i < data.length; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }
    return rows;
  };

  const pollVoucherData = async () => {
    try {
      const data = await getAllVoucher();
      setVoucherData(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching voucher data:", error);
      setError("Error fetching voucher data");
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      pollVoucherData();
    }, [])
  );

  useEffect(() => {
    const intervalId = setInterval(pollVoucherData, pollInterval);
    return () => clearInterval(intervalId);
  }, []);

  const handleReceive = async (voucherID) => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      const formData = new FormData();
      formData.append("accountID", accountId);
      formData.append("voucherID", voucherID);

      const response = await receiveVoucher(formData);
      if (response.status === 200) {
        Alert.alert("Success", "Receive voucher successfully!");
        pollVoucherData();
      } else {
        Alert.alert("Warning", "You have already receive this voucher!");
      }
    } catch (error) {
      console.error("Error receiving voucher:", error);
      Alert.alert(
        "Error",
        "An error occurred while receiving the voucher. Please try again later."
      );
    }
  };

  const VoucherLayout = ({ voucher }) => {
    return (
      <View style={styles.voucherCard}>
        <Image
          source={{ uri: `${URL_IMAGE}${voucher.voucherImage}` }}
          style={styles.voucherImage}
          resizeMode="contain"
        />
        <View style={styles.contentvoucher}>
          <Text style={styles.discountText} numberOfLines={1}
            ellipsizeMode="tail">{voucher.voucherName}</Text>
          <TouchableOpacity
            style={styles.getCouponButton}
            onPress={() => handleReceive(voucher.voucherID)}
          >
            <Text style={styles.buttonText}>Get Coupon</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  const vouchersRows = splitIntoRows(hotelVoucher, 2);

  const renderVoucher = ({ item }) => (
    <View style={styles.vouchersRow}>
      {item.map((voucher) => (
        <View key={voucher.voucherID} style={styles.voucherWrapper}>
          <VoucherLayout voucher={voucher} />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Most Outstanding Vouchers</Text>
      </View>
      {hotelVoucher.length === 0 ? (
        <View style={styles.noVouchersContainer}>
          <Text style={styles.noVouchersText}>No vouchers found!</Text>
        </View>
      ) : (
        <FlatList
          data={vouchersRows}
          renderItem={renderVoucher}
          keyExtractor={(item, index) => `row-${index}`}
          contentContainerStyle={styles.vouchersList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: pixelNormalize(10),
  },
  header: {
    marginBottom: pixelNormalize(10),
  },
  headerTitle: {
    fontSize: pixelNormalize(20),
    fontWeight: "bold",
  },
  vouchersList: {
    flexGrow: 1,
  },
  vouchersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: pixelNormalize(15),
  },
  voucherWrapper: {
    width: "48%",
  },
  voucherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: pixelNormalize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: pixelNormalize(2) },
    shadowOpacity: 0.1,
    shadowRadius: pixelNormalize(5),
    elevation: pixelNormalize(5),
  },
  voucherImage: {
    width: "100%",
    height: pixelNormalize(100),
    borderRadius: pixelNormalize(10),
  },
  contentvoucher: {
    padding: pixelNormalize(10),
  },
  discountText: {
    textAlign: "center",
    fontSize: pixelNormalize(15),
    fontWeight: "bold",
    marginBottom: pixelNormalize(15),
  },
  getCouponButton: {
    backgroundColor: "#00A5F5",
    paddingVertical: pixelNormalize(8),
    paddingHorizontal: pixelNormalize(10),
    borderRadius: pixelNormalize(8),
    width: pixelNormalize(100),
    alignSelf: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: pixelNormalize(12),
    fontWeight: "bold",
  },
  noVouchersContainer: {
    flex: 1,
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  noVouchersText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
  },
});

export default VouchersLayout;
