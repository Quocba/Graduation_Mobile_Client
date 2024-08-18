import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { getBookingByAccountId } from "../(auth)/Auth.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  calculateNights,
  formatDateMonthAndDay,
  formatDateWithWeekDay,
  formatPrice,
} from "../../utils/helper";

const MyBookingsPage = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "My Bookings",
  }).setHeaderOptions;

  useEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = [
    "all",
    "Awaiting Check-in",
    "Awaiting Payment",
    "Completed",
    "Canceled",
  ];

  const init = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      if (accountId) {
        const res = await getBookingByAccountId(accountId);
        if (res) {
          setMyBookings(res);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      init();
    }, [])
  );

  const handleBookingPress = useCallback(
    (booking) => {
      switch (booking.status) {
        case "Awaiting Check-in":
          navigation.navigate("BookingDetailAwaitingCheckin", {
            bookingAwitingCheckinId: booking.bookingID,
          });
          break;
        case "Awaiting Payment":
          navigation.navigate("BookingDetailAwaitingPayment", {
            bookingAwaitingPaymentId: booking.bookingID,
          });
          break;
        case "Completed":
          navigation.navigate("BookingDetailCompleted", {
            bookingCompletedId: booking.bookingID,
          });
          break;
        case "Canceled":
          navigation.navigate("BookingDetailCanceled", {
            bookingCanceledId: booking.bookingID,
          });
          break;
        default:
          break;
      }
    },
    [navigation]
  );

  const renderBookingItem = useCallback(
    (item) => {
      let statusStyle;
      switch (item.status) {
        case "Awaiting Check-in":
          statusStyle = styles.statusAwaitingCheckin;
          break;
        case "Awaiting Payment":
          statusStyle = styles.statusAwaitingPayment;
          break;
        case "Completed":
          statusStyle = styles.statusCompleted;
          break;
        case "Canceled":
          statusStyle = styles.statusCanceled;
          break;
        default:
          statusStyle = styles.status;
          break;
      }

      return (
        <TouchableOpacity
          onPress={() => handleBookingPress(item)}
          key={item.bookingID}
        >
          <View
            style={[
              styles.bookingItem,
              item.status === "Canceled" && styles.canceledBookingItem,
            ]}
          >
            <View style={styles.bookingHeader}>
              <Text
                style={styles.bookingNo}
              >{`Booking No. 78945${item?.bookingID}`}</Text>
              <Text style={[styles.status, statusStyle]}>{item?.status}</Text>
            </View>
            <Text
              style={styles.bookingDate}
            >{`Booking Date: ${formatDateWithWeekDay(
              item?.checkInDate
            )}`}</Text>
            <View style={styles.bookingRight}>
              <Image
                source={{ uri: `${URL_IMAGE}${item?.hotel?.mainImage}` }}
                style={styles.bookingImage}
                resizeMode="cover"
              />
              <View style={styles.bookingDetails}>
                <View style={styles.bookingRow}>
                  <Text
                    style={styles.titleHotel}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item?.hotel?.name}
                  </Text>
                  <Text style={styles.totalPrice}>
                    {formatPrice(Math.ceil(item?.totalPrice))} VND
                  </Text>
                </View>
                <View style={styles.ContainRow}>
                  <View style={styles.bookingRow}>
                    <Text style={styles.roomType} numberOfLines={2}
                      ellipsizeMode="tail">
                      {item?.room?.typeOfRoom}
                    </Text>
                    <Text style={styles.guestName}>
                      {item?.account?.profile?.fullName}
                    </Text>
                  </View>
                  <Text style={styles.dateRange}>
                    {formatDateMonthAndDay(item?.checkInDate)}
                    <Text style={{ textAlign: "center" }}> - </Text>
                    {formatDateMonthAndDay(item?.checkOutDate)}
                  </Text>
                  <View style={styles.additionalInfo}>
                    <Text style={styles.nights}>
                      {calculateNights(item?.checkInDate, item?.checkOutDate) <=
                        1
                        ? `${calculateNights(
                          item?.checkInDate,
                          item?.checkOutDate
                        )} night`
                        : `${calculateNights(
                          item?.checkInDate,
                          item?.checkOutDate
                        )} nights`}
                    </Text>
                    <Text style={styles.guests}>
                      {item?.numberOfGuest <= 1
                        ? `${item?.numberOfGuest} guest`
                        : `${item?.numberOfGuest} guests`}
                    </Text>
                  </View>
                </View>
                {(item.status === "Completed" ||
                  item.status === "Canceled") && (
                    <TouchableOpacity
                      style={styles.bookingAgainButton}
                      onPress={() =>
                        navigation.navigate("Booking", {
                          hotelId: item?.hotel?.hotelID,
                          roomId: item?.room?.roomID,
                        })
                      }
                    >
                      <Text style={styles.bookingAgainText}>Book Again</Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleBookingPress]
  );

  const sortedBookingsData = useMemo(
    () => [
      ...myBookings.filter((booking) => booking.status !== "Canceled"),
      ...myBookings.filter((booking) => booking.status === "Canceled"),
    ],
    [myBookings]
  );

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 40,
      backgroundColor: "#F0F2F5",
      padding: 10,
    },
    filtersContainerWrapper: {
      backgroundColor: "#FFFFFF",
      elevation: 10,
      borderColor: "#CCCCCC",
      borderWidth: 1,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 15,
    },
    filtersContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      height: 40,
    },
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginRight: 10,
      minWidth: 80,
    },
    filterText: {
      fontSize: 16,
      color: "#000000",
      fontWeight: "bold",
      textAlign: "center",
    },
    activeFilter: {
      borderRadius: 20,
      borderBottomWidth: 2,
      borderBottomColor: "#00A5F5",
    },
    activeFilterText: {
      color: "#00A5F5",
    },
    bookingItem: {
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      paddingVertical: 10,
      elevation: 5,
      borderColor: "#CCCCCC",
      borderWidth: 1,
    },
    canceledBookingItem: {
      backgroundColor: "#E0E0E0",
    },
    bookingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    bookingNo: {
      fontWeight: "bold",
      fontSize: 16,
    },
    bookingDate: {
      fontSize: 14,
      color: "#777",
    },
    status: {
      fontSize: 16,
      fontWeight: "bold",
    },
    statusAwaitingCheckin: {
      color: "#3A73E7",
    },
    statusAwaitingPayment: {
      color: "#FFA500",
    },
    statusCompleted: {
      color: "#11D749",
    },
    statusCanceled: {
      color: "#F14542",
    },
    bookingRight: {
      flexDirection: "row",
      paddingTop: 10,
    },
    bookingImage: {
      marginTop: 5,
      width: 150,
      height: 183,
      borderRadius: 10,
      marginRight: 10,
    },
    bookingDetails: {
      flex: 1,
    },
    bookingRow: {
      marginBottom: 5,
    },
    titleHotel: {
      paddingLeft: 10,
      fontSize: 16,
      fontWeight: "bold",
    },
    totalPrice: {
      fontWeight: "bold",
      fontSize: 16,
      paddingLeft: 10,
      paddingTop: 5,
      paddingBottom: 5,
    },
    ContainRow: {
      borderWidth: 2,
      padding: 10,
      borderColor: "#A9A9A9",
      borderRadius: 10,
    },
    dateRange: {
      fontSize: 14,
      color: "#A9A9A9",
    },
    roomType: {
      paddingBottom: 5,
      fontSize: 14,
      fontWeight: "bold",
    },
    guestName: {
      fontSize: 14,
      color: "#000000",
      fontWeight: "bold",
    },
    additionalInfo: {
      flexDirection: "row",
      marginTop: 5,
      justifyContent: "space-between",
    },
    nights: {
      color: "#A9A9A9",
    },
    guests: {
      color: "#A9A9A9",
    },
    bookingAgainButton: {
      backgroundColor: "#00A5F5",
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginTop: 10,
      alignSelf: "flex-end",
    },
    bookingAgainText: {
      fontSize: 14,
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    noBookings: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    noBookingsText: {
      fontSize: 16,
      color: "#A9A9A9",
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.filtersContainerWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.filtersContainer}
            showsHorizontalScrollIndicator={false}
          >
            {filters.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterButton,
                  activeFilter === item && styles.activeFilter,
                ]}
                onPress={() => setActiveFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === item && styles.activeFilterText,
                  ]}
                >
                  {capitalizeFirstLetter(item.replace("_", " "))}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ScrollView
          style={styles.bookingsContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.noBookings}>
              <Text style={styles.noBookingsText}>
                Loading your bookings...
              </Text>
            </View>
          ) : sortedBookingsData.length > 0 ? (
            sortedBookingsData
              .filter(
                (item) => activeFilter === "all" || item.status === activeFilter
              )
              .map(renderBookingItem)
          ) : (
            <View style={styles.noBookings}>
              <Text style={styles.noBookingsText}>
                You don't have any bookings yet
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyBookingsPage;
