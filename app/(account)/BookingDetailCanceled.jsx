import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { getBookingDetails, cancelBooking } from "../(auth)/Auth.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import {
  calculateNights,
  formatDateWithWeekDay,
  formatPhoneNumber,
  formatPriceWithType,
} from "../../utils/helper";

const BookingDetailCanceled = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingCanceledId } = route.params;
  const [error, setError] = useState(null);
  const [bookingDetailCanceled, setBookingDetailCanceled] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRoomDetailsExpanded, setRoomDetailsExpanded] = useState(false);
  const toggleRoomDetails = () => {
    setRoomDetailsExpanded(!isRoomDetailsExpanded);
  };
  const nights = calculateNights(
    bookingDetailCanceled?.checkInDate,
    bookingDetailCanceled?.checkOutDate
  );

  React.useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const headerOptions = HeaderNormal({
    title: "Canceled",
  }).setHeaderOptions;
  const fetchBookingDetails = async () => {
    try {
      const res = await getBookingDetails(bookingCanceledId);
      if (res) {
        setBookingDetailCanceled(res);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      Alert.alert("Error", "Failed to fetch booking details.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.topSection}>
            <Text
              style={styles.bookingNo}
            >{`Booking No. ${bookingDetailCanceled.bookingID}`}</Text>
            <Text style={[styles.status, styles.statusCanceled]}>
              {bookingDetailCanceled.status}
            </Text>
          </View>

          <Text style={styles.sectionReason}>
            <Text style={styles.textsectionReason}>Reason canceled: </Text>
            {bookingDetailCanceled.resaonCacle}
          </Text>

          <Text style={styles.sectionTitleRoom}>
            {bookingDetailCanceled.room?.typeOfRoom}
          </Text>
          <View style={styles.rowSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Check-in</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(bookingDetailCanceled.checkInDate)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Check-out</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(bookingDetailCanceled.checkOutDate)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Night</Text>
              <Text style={styles.text}>
                {calculateNights(
                  bookingDetailCanceled.checkInDate,
                  bookingDetailCanceled.checkOutDate
                ) === 1
                  ? `${calculateNights(
                      bookingDetailCanceled.checkInDate,
                      bookingDetailCanceled.checkOutDate
                    )} night`
                  : `${calculateNights(
                      bookingDetailCanceled.checkInDate,
                      bookingDetailCanceled.checkOutDate
                    )} nights`}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.textRoomGues}>Rooms:</Text>
              <Text style={styles.text}>
                {bookingDetailCanceled?.room?.numberOfBed}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textRoomGues}>Guests:</Text>
              <Text style={styles.text}>
                {bookingDetailCanceled?.bookingAccount?.profile?.fullName}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleInfor}>Contact Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.text}>
              {bookingDetailCanceled?.bookingAccount?.profile?.fullName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>
              {bookingDetailCanceled?.bookingAccount?.email}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.text}>
              {bookingDetailCanceled?.bookingAccount?.phone}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowhotel}>
            <Image
              source={{
                uri: `${URL_IMAGE}${bookingDetailCanceled?.room?.hotel?.mainImage}`,
              }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>
                {bookingDetailCanceled?.room?.hotel?.name}
              </Text>
              <Text style={styles.address}>
                {bookingDetailCanceled?.room?.hotel?.hotelAddress?.address}
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Type of Room:</Text>
                <Text style={styles.text}>
                  {bookingDetailCanceled?.room?.typeOfRoom}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Bed:</Text>
                <Text style={styles.text}>
                  {bookingDetailCanceled?.room?.numberOfBed <= 1
                    ? `${bookingDetailCanceled?.room?.numberOfBed} ${bookingDetailCanceled?.room?.typeOfBed} Bed`
                    : `${bookingDetailCanceled?.room?.numberOfBed} ${bookingDetailCanceled?.room?.typeOfBed} Beds`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Price For:</Text>
                <Text style={styles.text}>
                  {bookingDetailCanceled?.numberOfGuest <= 1
                    ? `${bookingDetailCanceled?.numberOfGuest} person`
                    : `${bookingDetailCanceled?.numberOfGuest} people`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Call Hotel:</Text>
                <Text style={styles.text}>
                  {formatPhoneNumber(
                    bookingDetailCanceled?.room?.hotel?.parnerAccount?.phone
                  )}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email Hotel:</Text>
                <Text style={styles.text}>
                  {bookingDetailCanceled?.room?.hotel?.parnerAccount?.email}
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
                    {bookingDetailCanceled?.unitPrice
                      ? formatPriceWithType(
                          Math.ceil(bookingDetailCanceled?.unitPrice)
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
                    {bookingDetailCanceled?.unitPrice && nights
                      ? formatPriceWithType(
                          Math.ceil(bookingDetailCanceled?.unitPrice * nights)
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Booked Rooms({bookingDetailCanceled?.numberOfRoom})
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetailCanceled?.unitPrice &&
                    bookingDetailCanceled?.numberOfRoom
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailCanceled?.unitPrice *
                              bookingDetailCanceled?.numberOfRoom
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
                    {bookingDetailCanceled?.unitPrice &&
                    bookingDetailCanceled?.numberOfRoom &&
                    nights
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailCanceled?.unitPrice *
                              bookingDetailCanceled?.numberOfRoom *
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
                {bookingDetailCanceled?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(
                        bookingDetailCanceled?.unitPrice *
                          bookingDetailCanceled?.numberOfRoom *
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
                {bookingDetailCanceled?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(bookingDetailCanceled?.taxesPrice)
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
            {bookingDetailCanceled?.voucher && (
              <View style={styles.rowTitel}>
                <Text style={styles.labelCantantPriceDetails}>Voucher</Text>
                <Text style={styles.textVoucher}>
                  -{" "}
                  {formatPriceWithType(
                    Math.ceil(
                      (bookingDetailCanceled?.unitPrice *
                        bookingDetailCanceled?.numberOfRoom *
                        nights +
                        bookingDetailCanceled?.taxesPrice +
                        bookingDetailCanceled?.unitPrice *
                          bookingDetailCanceled?.numberOfRoom *
                          nights *
                          0.1) *
                        (bookingDetailCanceled?.voucher?.discount / 100)
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
                {bookingDetailCanceled?.totalPrice
                  ? formatPriceWithType(
                      Math.ceil(bookingDetailCanceled?.totalPrice)
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  statusCanceled: {
    color: "#F14542",
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
    fontWeight: "bold",
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
  labelCantantPriceDetails: {
    fontSize: 14,
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
  rowTitel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  rowTitelTotelPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelCantant: {
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    fontWeight: "bold",
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
  TitlePriceDetail: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
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
  rowTitleWithArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
    marginBottom: 10,
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rowTitelRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginLeft: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  texttotalPrice: {
    fontWeight: "bold",
    fontSize: 14,
  },
  sectionReason: {
    fontSize: 15,
    marginBottom: 5,
  },
  textsectionReason: {
    fontSize: 15,
    color: "#A9A9A9",
  },
});

export default BookingDetailCanceled;
