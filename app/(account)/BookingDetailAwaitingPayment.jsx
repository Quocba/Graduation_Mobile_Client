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
import { getBookingDetails } from "../(auth)/Auth.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import {
  calculateNights,
  formatDateWithWeekDay,
  formatPhoneNumber,
  formatPriceWithType,
} from "../../utils/helper";

const BookingDetailAwaitingPayment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingAwaitingPaymentId } = route.params;
  const [error, setError] = useState(null);
  const [bookingDetailAwaitingPaymentId, setBookingDetailAwaitingPaymentId] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [isRoomDetailsExpanded, setRoomDetailsExpanded] = useState(false);
  const toggleRoomDetails = () => {
    setRoomDetailsExpanded(!isRoomDetailsExpanded);
  };
  const nights = calculateNights(
    bookingDetailAwaitingPaymentId?.checkInDate,
    bookingDetailAwaitingPaymentId?.checkOutDate
  );

  const headerOptions = HeaderNormal({
    title: "Awaiting Payment",
  }).setHeaderOptions;

  React.useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const fetchBookingDetails = async () => {
    try {
      const res = await getBookingDetails(bookingAwaitingPaymentId);
      if (res) {
        setBookingDetailAwaitingPaymentId(res);
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.topSection}>
            <Text
              style={styles.bookingNo}
            >{`Booking No. ${bookingDetailAwaitingPaymentId?.bookingID}`}</Text>
            <Text style={[styles.status, styles.statusAwaitingPayment]}>
              {bookingDetailAwaitingPaymentId?.status}
            </Text>
          </View>

          <Text style={styles.sectionTitleRoom}>
            {bookingDetailAwaitingPaymentId?.room?.typeOfRoom}
          </Text>
          <View style={styles.rowSection}>
            <View style={styles.infoItem}>
              <Text style={styles.sectionTitle}>Check-in</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(
                  bookingDetailAwaitingPaymentId?.checkInDate
                )}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.sectionTitle}>Check-out</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(
                  bookingDetailAwaitingPaymentId?.checkOutDate
                )}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.sectionTitle}>Night</Text>
              <Text style={styles.text}>
                {calculateNights(
                  bookingDetailAwaitingPaymentId?.checkInDate,
                  bookingDetailAwaitingPaymentId?.checkOutDate
                ) === 1
                  ? `${calculateNights(
                      bookingDetailAwaitingPaymentId?.checkInDate,
                      bookingDetailAwaitingPaymentId?.checkOutDate
                    )} night`
                  : `${calculateNights(
                      bookingDetailAwaitingPaymentId?.checkInDate,
                      bookingDetailAwaitingPaymentId?.checkOutDate
                    )} nights`}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.textRoomGuest}>Rooms:</Text>
              <Text style={styles.text}>
                {bookingDetailAwaitingPaymentId?.room?.numberOfBed}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textRoomGuest}>Guests:</Text>
              <Text style={styles.text}>
                {
                  bookingDetailAwaitingPaymentId?.bookingAccount?.profile
                    ?.fullName
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleInfor}>Contact Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.text}>
              {
                bookingDetailAwaitingPaymentId?.bookingAccount?.profile
                  ?.fullName
              }
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>
              {bookingDetailAwaitingPaymentId?.bookingAccount?.email}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.text}>
              {bookingDetailAwaitingPaymentId?.bookingAccount?.phone}
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.hotelSection]}>
          <View style={styles.rowhotel}>
            <Image
              source={{
                uri: `${URL_IMAGE}${bookingDetailAwaitingPaymentId?.room?.hotel?.mainImage}`,
              }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>
                {bookingDetailAwaitingPaymentId?.room?.hotel?.name}
              </Text>
              <Text style={styles.address}>
                {
                  bookingDetailAwaitingPaymentId?.room?.hotel?.hotelAddress
                    ?.address
                }
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Type of Room:</Text>
                <Text style={styles.text}>
                  {bookingDetailAwaitingPaymentId?.room?.typeOfRoom}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Bed:</Text>
                <Text style={styles.text}>
                  {bookingDetailAwaitingPaymentId?.room?.numberOfBed <= 1
                    ? `${bookingDetailAwaitingPaymentId?.room?.numberOfBed} ${bookingDetailAwaitingPaymentId?.room?.typeOfBed} Bed`
                    : `${bookingDetailAwaitingPaymentId?.room?.numberOfBed} ${bookingDetailAwaitingPaymentId?.room?.typeOfBed} Beds`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Price For:</Text>
                <Text style={styles.text}>
                  {bookingDetailAwaitingPaymentId?.numberOfGuest <= 1
                    ? `${bookingDetailAwaitingPaymentId?.numberOfGuest} person`
                    : `${bookingDetailAwaitingPaymentId?.numberOfGuest} people`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Call Hotel:</Text>
                <Text style={styles.text}>
                  {formatPhoneNumber(
                    bookingDetailAwaitingPaymentId?.room?.hotel?.parnerAccount
                      ?.phone
                  )}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email Hotel:</Text>
                <Text style={styles.text}>
                  {
                    bookingDetailAwaitingPaymentId?.room?.hotel?.parnerAccount
                      ?.email
                  }
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
                    {bookingDetailAwaitingPaymentId?.unitPrice
                      ? formatPriceWithType(
                          Math.ceil(bookingDetailAwaitingPaymentId?.unitPrice)
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
                    {bookingDetailAwaitingPaymentId?.unitPrice && nights
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailAwaitingPaymentId?.unitPrice * nights
                          )
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Booked Rooms({bookingDetailAwaitingPaymentId?.numberOfRoom})
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetailAwaitingPaymentId?.unitPrice &&
                    bookingDetailAwaitingPaymentId?.numberOfRoom
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailAwaitingPaymentId?.unitPrice *
                              bookingDetailAwaitingPaymentId?.numberOfRoom
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
                    {bookingDetailAwaitingPaymentId?.unitPrice &&
                    bookingDetailAwaitingPaymentId?.numberOfRoom &&
                    nights
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailAwaitingPaymentId?.unitPrice *
                              bookingDetailAwaitingPaymentId?.numberOfRoom *
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
                {bookingDetailAwaitingPaymentId?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(
                        bookingDetailAwaitingPaymentId?.unitPrice *
                          bookingDetailAwaitingPaymentId?.numberOfRoom *
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
                {bookingDetailAwaitingPaymentId?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(bookingDetailAwaitingPaymentId?.taxesPrice)
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
            {bookingDetailAwaitingPaymentId?.voucher && (
              <View style={styles.rowTitel}>
                <Text style={styles.labelCantantPriceDetails}>Voucher</Text>
                <Text style={styles.textVoucher}>
                  -{" "}
                  {formatPriceWithType(
                    Math.ceil(
                      (bookingDetailAwaitingPaymentId?.unitPrice *
                        bookingDetailAwaitingPaymentId?.numberOfRoom *
                        nights +
                        bookingDetailAwaitingPaymentId?.taxesPrice +
                        bookingDetailAwaitingPaymentId?.unitPrice *
                          bookingDetailAwaitingPaymentId?.numberOfRoom *
                          nights *
                          0.1) *
                        (bookingDetailAwaitingPaymentId?.voucher?.discount /
                          100)
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
                {bookingDetailAwaitingPaymentId?.totalPrice
                  ? formatPriceWithType(
                      Math.ceil(bookingDetailAwaitingPaymentId?.totalPrice)
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
  statusAwaitingPayment: {
    color: "#FFA500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 5,
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  sectionTitleInfor: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
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
  textRoomGuest: {
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
  rowTitel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottomWidth: 2,
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
  priceDetails: {
    borderWidth: 2,
    padding: 10,
    borderColor: "#A9A9A9",
    borderRadius: 10,
  },
  total: {
    fontWeight: "bold",
  },
  hotelSection: {
    marginTop: 10,
  },
  infoItem: {
    flex: 1,
  },
  rowTitleWithArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
    marginBottom: 10,
  },
  labelCantantPriceDetails: {
    fontSize: 14,
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
});

export default BookingDetailAwaitingPayment;
