import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderNormal from "../../../components/HeaderNormal";
import { URL_IMAGE } from "../../../services/ApiUrl";

const ModelViewMyVouchers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { voucherData } = route.params;

  const headerOptions = HeaderNormal({
    title: "View Voucher",
    navigation: navigation,
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.contentView}>
            <Text style={styles.title}>Voucher Details</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Image</Text>
              <View style={styles.boxedContent}>
                <Image
                  source={{
                    uri: `${URL_IMAGE}${voucherData?.voucher?.voucherImage}`,
                  }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voucher Name</Text>
              <View style={styles.boxedContent}>
                <Text style={styles.sectionContent}>
                  {voucherData?.voucher?.voucherName}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voucher Code</Text>
              <View style={styles.boxedContent}>
                <Text style={styles.sectionContent}>
                  {voucherData?.voucher?.code}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Discount</Text>
              <View style={styles.boxedContent}>
                <Text style={styles.sectionContent}>
                  {voucherData?.voucher?.discount}%
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.boxedContent}>
                <Text style={styles.sectionContentDes}>
                  {voucherData?.voucher?.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  contentView: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333333",
  },
  boxedContent: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: "#555555",
  },
  sectionContentDes: {
    fontSize: 14,
    marginTop: 5,
    color: "#555555",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});

export default ModelViewMyVouchers;
