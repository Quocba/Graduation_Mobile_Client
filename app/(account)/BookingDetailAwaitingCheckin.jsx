import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import ModalCancelBooking from "./Modal/ModelCancelBooking";
import { getBookingDetails, cancelBooking } from "../(auth)/Auth.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import { useRoute } from "@react-navigation/native";
import {
  calculateNights,
  formatDateWithWeekDay,
  formatPhoneNumber,
  formatPriceWithType,
} from "../../utils/helper";

const BookingDetailAwaitingCheckin = () => {
  const route = useRoute();
  const { bookingAwitingCheckinId } = route.params;

  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigation = useNavigation();
  const [reason, setReason] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRoomDetailsExpanded, setRoomDetailsExpanded] = useState(false);
  const toggleRoomDetails = () => {
    setRoomDetailsExpanded(!isRoomDetailsExpanded);
  };

  const reasonCancel = [
    "Change of travel plans",
    "Health issues",
    "Family emergency",
    "Unable to get time off work",
    "Financial issues",
    "Bad weather forecast",
    "Found better accommodation",
    "Change of destination",
    "Work emergency",
  ];

  const headerOptions = HeaderNormal({
    title: "Awaiting Check-in",
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (reason !== "") {
      handleCancelConfirm();
    }
  }, [reason]);

  const init = async () => {
    try {
      const res = await getBookingDetails(bookingAwitingCheckinId);
      if (res) {
        setBookingDetails(res);
      }
    } catch (error) {
      console.error("Error when retrieving booking details", error);
      Alert.alert("Error", "Retrieving booking details failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPress = () => {
    setModalVisible(true);
  };

  const handleCancelConfirm = async () => {
    if (!reason) {
      Alert.alert("Error", "Please select a cancellation reason.");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("bookingID", bookingAwitingCheckinId);
      formData.append("Reason", reason);

      const response = await cancelBooking(formData);

      if (response.status === 200) {
        setModalVisible(false);
        Alert.alert("Successful", "Reservation canceled successfully.");
        navigation.navigate("MyBookingsPage");
      } else {
        console.error("Error canceling booking:", response);
        Alert.alert("Error", "Cancellation of booking failed!");
      }
    } catch (error) {
      console.error("Error calling API to cancel booking:", error);
      Alert.alert("Error", "Cancellation of booking failed!");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const nights = calculateNights(
    bookingDetails?.checkInDate,
    bookingDetails?.checkOutDate
  );
  const timeRemaining =
    new Date(bookingDetails?.checkInDate).getTime() - new Date().getTime();

  const canCancel = timeRemaining > 86400000;

  return (
    <SafeAreaView style={{ flex: 1, paddingVertical: 10 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.section}>
          <View style={styles.topSection}>
            <Text
              style={styles.bookingNo}
            >{`Booking No. ${bookingDetails?.bookingID}`}</Text>
            <Text style={[styles.status, styles.statusAwaitingCheckin]}>
              {bookingDetails?.status}
            </Text>
          </View>
          <Text style={styles.sectionTitleRoom}>
            {bookingDetails?.room?.typeOfRoom}
          </Text>
          <View style={styles.rowSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Check-in</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(bookingDetails?.checkInDate)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Check-out</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(bookingDetails?.checkOutDate)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Night</Text>
              <Text style={styles.text}>
                {calculateNights(
                  bookingDetails?.checkInDate,
                  bookingDetails?.checkOutDate
                ) === 1
                  ? `${calculateNights(
                      bookingDetails?.checkInDate,
                      bookingDetails?.checkOutDate
                    )} night`
                  : `${calculateNights(
                      bookingDetails?.checkInDate,
                      bookingDetails?.checkOutDate
                    )} nights`}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.textRoomGues}>Rooms:</Text>
              <Text style={styles.text}>
                {bookingDetails?.room?.numberOfBed}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textRoomGues}>Guests:</Text>
              <Text style={styles.text}>
                {bookingDetails?.bookingAccount?.profile?.fullName}
              </Text>
            </View>
          </View>
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelPress}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleInfor}>Contact Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.text}>
              {bookingDetails?.bookingAccount?.profile?.fullName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>
              {bookingDetails?.bookingAccount?.email}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.text}>
              {bookingDetails?.bookingAccount?.phone}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowhotel}>
            <Image
              source={{
                uri: `${URL_IMAGE}${bookingDetails?.room?.hotel?.mainImage}`,
              }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>
                {bookingDetails?.room?.hotel?.name}
              </Text>
              <Text style={styles.address}>
                {bookingDetails?.room?.hotel?.hotelAddress?.address}
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Type of Room:</Text>
                <Text style={styles.text}>
                  {bookingDetails?.room?.typeOfRoom}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Bed:</Text>
                <Text style={styles.text}>
                  {bookingDetails?.room?.numberOfBed <= 1
                    ? `${bookingDetails?.room?.numberOfBed} ${bookingDetails?.room?.typeOfBed} Bed`
                    : `${bookingDetails?.room?.numberOfBed} ${bookingDetails?.room?.typeOfBed} Beds`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Price For:</Text>
                <Text style={styles.text}>
                  {bookingDetails?.numberOfGuest <= 1
                    ? `${bookingDetails?.numberOfGuest} person`
                    : `${bookingDetails?.numberOfGuest} people`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Call Hotel:</Text>
                <Text style={styles.text}>
                  {formatPhoneNumber(
                    bookingDetails?.room?.hotel?.parnerAccount?.phone
                  )}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email Hotel:</Text>
                <Text style={styles.text}>
                  {bookingDetails?.room?.hotel?.parnerAccount?.email}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.priceDetails}>
            <Text style={styles.TitlePriceDetail}>Price Details</Text>
            <TouchableOpacity
              style={styles.rowTitleWithArrow}
              onPress={toggleRoomDetails}
            >
              <Text style={styles.labelCantantPriceDetails}>Room</Text>
              <Text style={styles.arrow}>
                {isRoomDetailsExpanded ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {isRoomDetailsExpanded && (
              <>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>Each Room</Text>
                  <Text style={styles.text}>
                    {bookingDetails?.unitPrice
                      ? formatPriceWithType(
                          Math.ceil(bookingDetails?.unitPrice)
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Total{nights > 1 ? `Nights` : `Night`} ({nights})
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetails?.unitPrice && nights
                      ? formatPriceWithType(
                          Math.ceil(bookingDetails?.unitPrice * nights)
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Booked Rooms({bookingDetails?.numberOfRoom})
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetails?.unitPrice && bookingDetails?.numberOfRoom
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetails?.unitPrice *
                              bookingDetails?.numberOfRoom
                          )
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Total Price Room
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetails?.unitPrice &&
                    bookingDetails?.numberOfRoom &&
                    nights
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetails?.unitPrice *
                              bookingDetails?.numberOfRoom *
                              nights
                          )
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
              </>
            )}
            <View style={styles.rowTitel}>
              <Text style={styles.labelCantantPriceDetails}>Service Fee</Text>
              <Text style={styles.text}>
                {bookingDetails?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(
                        bookingDetails?.unitPrice *
                          bookingDetails?.numberOfRoom *
                          nights *
                          0.1
                      )
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
            <View style={styles.rowTitel}>
              <Text style={styles.labelCantantPriceDetails}>Taxes </Text>
              <Text style={styles.text}>
                {bookingDetails?.taxesPrice
                  ? formatPriceWithType(Math.ceil(bookingDetails?.taxesPrice))
                  : 0}{" "}
                VND
              </Text>
            </View>
            {bookingDetails?.voucher && (
              <View style={styles.rowTitel}>
                <Text style={styles.labelCantantPriceDetails}>Voucher</Text>
                <Text style={styles.textVoucher}>
                  -{" "}
                  {formatPriceWithType(
                    Math.ceil(
                      (bookingDetails?.unitPrice *
                        bookingDetails?.numberOfRoom *
                        nights +
                        bookingDetails?.taxesPrice +
                        bookingDetails?.unitPrice *
                          bookingDetails?.numberOfRoom *
                          nights *
                          0.1) *
                        (bookingDetails?.voucher?.discount / 100)
                    )
                  )}{" "}
                  VND
                </Text>
              </View>
            )}
            <View style={styles.rowTitelTotelPrice}>
              <Text style={styles.labelCantant}>Total Price</Text>
              <Text style={styles.texttotalPrice}>
                {" "}
                {bookingDetails?.totalPrice
                  ? formatPriceWithType(Math.ceil(bookingDetails?.totalPrice))
                  : 0}{" "}
                VND
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <ModalCancelBooking
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onConfirm={(selectedReason) => {
          setReason(selectedReason);
        }}
        reasons={reasonCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 10,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bookingNo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusAwaitingCheckin: {
    color: "#3A73E7",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    paddingVertical: 10,
    elevation: 5,
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 5,
    color: "#A9A9A9",
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  textVoucher: {
    fontSize: 14,
    marginBottom: 5,
    color: "#F14542",
  },
  textRoomGues: {
    fontSize: 14,
    marginRight: 20,
    marginBottom: 5,
    color: "#A9A9A9",
  },
  sectionTitleRoom: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  TitlePriceDetail: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  sectionTitleInfor: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    marginRight: -100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rowTitelRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginLeft: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  rowTitelTotelPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTitel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#F14542",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  labelCantant: {
    fontWeight: "bold",
    fontSize: 14,
  },
  labelCantantPriceDetails: {
    fontSize: 14,
  },
  textVoucher: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#F14542",
  },
  texttotalPrice: {
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    fontWeight: "bold",
  },
  rowTitleWithArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
    marginBottom: 10,
  },
  hotelImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 5,
  },
  roomType: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceDetails: {
    borderWidth: 2,
    padding: 10,
    borderColor: "#A9A9A9",
    borderRadius: 10,
  },
  total: {
    fontWeight: "bold",
  },
});

export default BookingDetailAwaitingCheckin;
