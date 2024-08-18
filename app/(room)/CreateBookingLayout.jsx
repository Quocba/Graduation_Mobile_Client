import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import HeaderNormal from "../../components/HeaderNormal";
import { themeColors } from "../../utils/theme/ThemeColor";
import {
  Entypo,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { images } from "../../constants";
import { pixelNormalize } from "../../components/Normalize";
import DatePicker from "react-native-date-ranges-picker";
import SelectDropdown from "react-native-select-dropdown";
import {
  calculateNights,
  formatDate,
  formatPhoneNumber,
  formatPrice,
} from "../../utils/helper";
import {
  BottomModal,
  ModalButton,
  ModalContent,
  ModalFooter,
  ModalTitle,
  SlideAnimation,
} from "react-native-modals";
import { getHotelDetails } from "../(hotel)/Hotel.Api";
import { checkRoomPrice, createBooking, getRoomDetails } from "./Room.Api";
import { getAllVoucherByAccountId, getProfile } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_IMAGE } from "../../services/ApiUrl";
import { format, isBefore, isSameDay, isValid, parse } from "date-fns";

const CreateBookingLayout = ({ navigation, route }) => {
  const [selectedUseVoucher, setSelectedUseVoucher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState({
    person: 1,
    room: 1,
  });
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checkAccept, setCheckAccept] = useState(false);

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [account, setAccount] = useState({});
  const [voucherByAccount, setVoucherByAccount] = useState([]);
  const [loading, setLoading] = useState(false);

  const [priceRoom, setPriceRoom] = useState(null);
  const dayNights = calculateNights(
    selectedDates?.startDate,
    selectedDates?.endDate
  );
  const taxesPrice = priceRoom * dayNights * options.room * 0.05;
  const serviceFee = priceRoom * dayNights * options.room * 0.1;
  const voucherPrice =
    (priceRoom * dayNights * options.room + taxesPrice + serviceFee) *
    (selectedUseVoucher?.discount / 100);

  const totalPrice = () => {
    if (voucherPrice) {
      return (
        priceRoom * dayNights * options.room +
        taxesPrice +
        serviceFee -
        voucherPrice
      );
    } else {
      return priceRoom * dayNights * options.room + taxesPrice + serviceFee;
    }
  };

  const removeSelectedVoucher = [
    ...voucherByAccount
      ?.filter((voucher) => voucher?.isVoucher)
      ?.map((item) => ({
        id: item?.voucher?.voucherID,
        code: item?.voucher?.code,
        discount: item?.voucher?.discount,
      })),
    { code: "Remove Selected Voucher" },
  ];

  const { width, height } = Dimensions.get("window");

  const header = HeaderNormal({
    title: "Booking Information",
  });

  const { hotelId, roomId } = route.params;

  const init = async () => {
    const dataHotel = await getHotelDetails(hotelId);

    if (dataHotel) {
      setHotel(dataHotel);
    }

    const dataRoom = await getRoomDetails(roomId);

    if (dataRoom) {
      setRoom(dataRoom);
    }

    const dataProfile = await getProfile(
      await AsyncStorage.getItem("accountId")
    );

    if (dataProfile) {
      setAccount(dataProfile);
    }

    const dataVoucherByAccount = await getAllVoucherByAccountId(
      await AsyncStorage.getItem("accountId")
    );

    if (dataVoucherByAccount) {
      setVoucherByAccount(dataVoucherByAccount);
    }
  };

  const selectDateToPrice = async () => {
    try {
      if (!selectedDates?.startDate || !selectedDates?.endDate) {
        return;
      }

      let formData = new FormData();

      formData.append("roomID", roomId);
      formData.append(
        "CheckInDate",
        format(selectedDates?.startDate, "yyyy-MM-dd")
      );
      formData.append(
        "CheckOutDate",
        format(selectedDates?.endDate, "yyyy-MM-dd")
      );

      const result = await checkRoomPrice(formData);

      if (result.status === 200) {
        setPriceRoom(result.data.price);
      } else {
        console.error(
          "API call failed or returned an unexpected status code: ",
          result.status
        );
      }
    } catch (error) {
      Alert.alert(
        "Error in selectDateToPrice: ",
        "Server maintenance is underway. Please try again later !"
      );
    }
  };

  const handleUpdateProfile = async () => {
    let isProfileValid = true;
    let isMessage = "";

    if (!account?.phone || account?.emai) {
      isMessage =
        "Please return to the account profile screen to update your phone !";
      isProfileValid = false;
    } else if (!account?.email || account?.phone) {
      isMessage =
        "Please return to the account profile screen to update your email !";
      isProfileValid = false;
    } else if (!account?.phone && !account?.email) {
      isMessage =
        "Please return to the account profile screen to update your email or phone !";
      isProfileValid = false;
    }

    if (!isProfileValid) {
      Alert.alert(
        "Invalid Profile",
        isMessage,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              console.log("OK Pressed");
              navigation.navigate("AccountProfile");
            },
          },
        ],
        { cancelable: false }
      );
      return;
    }
  };

  const handleSelectedCheckbox = () => {
    setCheckAccept(!checkAccept);
  };

  const handleBooking = async () => {
    try {
      if (!checkAccept) {
        Alert.alert(
          "Invalid Booking",
          "Please check the Terms of Services and Privacy Policy !",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                console.log("OK Pressed");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        let formData = new FormData();
        formData.append("AccountID", await AsyncStorage.getItem("accountId"));

        if (selectedUseVoucher !== null) {
          formData.append("VoucherID", selectedUseVoucher?.id);
        }
        formData.append("RoomID", roomId);

        if (priceRoom === null) {
          Alert.alert("Error", "Invalid dates values provided !");
        } else {
          formData.append(
            "CheckInDate",
            format(selectedDates?.startDate, "yyyy-MM-dd")
          );
          formData.append(
            "CheckOutDate",
            format(selectedDates?.endDate, "yyyy-MM-dd")
          );
          formData.append("TotalPrice", totalPrice());
          formData.append("TaxesPrice", taxesPrice);
          formData.append("NumberOfGuest", options.person);
          formData.append("NumberOfRoom", options.room);

          const result = await createBooking(formData);

          if (result.status === 200) {
            Alert.alert("Success", "Create booking successfully !");
            setTimeout(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: "HomeLayout" }],
              });
            }, 2000);
          } else {
            Alert.alert("Error", "Create booking failured !");
          }
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Server maintenance is underway. Please try again later !"
      );
    }
  };

  const handleOption = (option, operation) => {
    setOptions((prevOptions) => {
      let newOptions = { ...prevOptions };

      if (option === "room") {
        if (operation === "i") {
          newOptions.room += 1;
        } else if (operation === "d" && newOptions.room > 1) {
          newOptions.room -= 1;
        }
        // Update person count based on the new room count
        newOptions.person = Math.min(
          newOptions.person,
          room?.numberCapacity * newOptions.room
        );
      } else if (option === "person") {
        if (
          operation === "i" &&
          newOptions.person < room?.numberCapacity * newOptions.room
        ) {
          newOptions.person += 1;
        } else if (operation === "d" && newOptions.person > 1) {
          newOptions.person -= 1;
        }
      }

      // Save the new values to secureLocalStorage
      AsyncStorage.setItem("numberGuest", newOptions.person.toString());
      AsyncStorage.setItem("numberRoom", newOptions.room.toString());

      return newOptions;
    });
  };

  const handleSelectedDates = (dates) => {
    const startDate = parse(dates.startDate, "yyyy/MM/dd", new Date());
    const endDate = parse(dates.endDate, "yyyy/MM/dd", new Date());
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (isValid(startDate) && isValid(endDate)) {
      if (isBefore(startDate, today) && isBefore(endDate, today)) {
        Alert.alert("Warning", "Check-in and Check-out cannot be in the past.");
        setSelectedDates({ startDate: null, endDate: null });
        setPriceRoom(null);
        return;
      }

      if (
        isBefore(startDate, today) &&
        (!isBefore(endDate, today) || isSameDay(endDate, today))
      ) {
        Alert.alert(
          "Warning",
          "Check-in cannot be in the past. Please select a current or future date."
        );
        setSelectedDates({ startDate: null, endDate: null });
        setPriceRoom(null);
        return;
      }

      if (isSameDay(startDate, endDate)) {
        Alert.alert(
          "Warning",
          "Check-in date cannot equal to Check-out date !"
        );
        setSelectedDates({ startDate: null, endDate: null });
        setPriceRoom(null);
        return;
      }

      setSelectedDates({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      });

      selectDateToPrice();
    } else {
      Alert.alert("Error", "Invalid date values provided.");
    }
  };

  const getRoomPlaceholder = (room, person) => {
    const roomPlaceholder = room === 1 ? "room" : "rooms";
    const personPlaceholder = person === 1 ? "person" : "people";
    return `${room} ${roomPlaceholder} and ${person} ${personPlaceholder}`;
  };

  const customButton = (onConfirm) => {
    return (
      <TouchableOpacity
        onPress={onConfirm}
        style={{
          width: "30%",
          alignItems: "center",
          padding: 10,
          backgroundColor: themeColors.primary_600,
          borderRadius: 4,
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "500", color: themeColors.white }}
        >
          Submit
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    selectDateToPrice();
  }, [selectedDates]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    init();
  }, [account]);

  useLayoutEffect(() => {
    navigation.setOptions(header.setHeaderOptions());
  }, [navigation, header]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bkgPage }}>
      {loading ? (
        <ScrollView
          vertical
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 10 }}
        >
          <View
            style={{
              backgroundColor: themeColors.white,
              borderRadius: 8,
              shadowColor: themeColors.boxShadowHover,
              elevation: 4,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: themeColors.title,
                }}
              >
                {hotel?.name}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                }}
              >
                {hotel?.hotelStandar === 1 ? (
                  <Entypo
                    name="star"
                    size={18}
                    color={themeColors.starRating}
                  />
                ) : null}

                {hotel?.hotelStandar === 2 ? (
                  <>
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                  </>
                ) : null}

                {hotel?.hotelStandar === 3 ? (
                  <>
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                  </>
                ) : null}

                {hotel?.hotelStandar === 4 ? (
                  <>
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                  </>
                ) : null}

                {hotel?.hotelStandar === 5 ? (
                  <>
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                    <Entypo
                      name="star"
                      size={18}
                      color={themeColors.starRating}
                    />
                  </>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Fontisto
                  name="map-marker-alt"
                  size={18}
                  color={themeColors.primary_600}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    paddingHorizontal: 8,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {hotel?.hotelAddress?.address}
                </Text>
              </View>

              <View style={{ marginTop: 6 }}>
                <Image
                  style={{
                    width: width - 50,
                    height: height / 3.5,
                  }}
                  source={{
                    uri: `${URL_IMAGE}${hotel?.mainImage}`,
                  }}
                />
              </View>
            </View>

            <View style={{ marginTop: 6, gap: 8 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: themeColors.title,
                }}
              >
                {room?.typeOfRoom}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={themeColors.black}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {room?.numberCapacity <= 1
                      ? `${room?.numberCapacity} person`
                      : `${room?.numberCapacity} people`}
                  </Text>
                </View>

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons
                    name="bed-outline"
                    size={20}
                    color={themeColors.black}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {room?.numberOfBed} {room?.typeOfBed}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    color={themeColors.black}
                    source={images.surFace}
                    style={{
                      width: pixelNormalize(20),
                      height: pixelNormalize(20),
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {room?.sizeOfRoom} m
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 12,
                      color: themeColors.black,
                    }}
                  >
                    2
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: themeColors.black,
                }}
              >
                Reservations{" "}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: themeColors.text_Link,
                  }}
                >
                  can be canceled
                </Text>{" "}
                before 24 hours from check-in date
              </Text>

              <View
                style={{
                  width: "100%",
                  height: 0.5,
                  borderWidth: 0.2,
                  borderColor: themeColors.gray,
                }}
              ></View>

              <View
                style={{
                  marginTop: 4,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    backgroundColor: themeColors.bg_Disabled,
                    borderRadius: 4,
                  }}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                      height: 25,
                      borderRadius: 0,
                      borderWidth: 0,
                      borderColor: "transparent",
                    }}
                    customStyles={{
                      placeholderText: {
                        fontSize: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: "auto",
                        color: themeColors.black,
                      },
                      headerStyle: {
                        backgroundColor: themeColors.primary_Default,
                      },
                      contentText: {
                        fontSize: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        marginRight: "auto",
                      },
                    }}
                    selectedBgColor={themeColors.primary_600}
                    customButton={(onConfirm) => customButton(onConfirm)}
                    onConfirm={(startDate, endDate) =>
                      handleSelectedDates(startDate, endDate)
                    }
                    allowFontScaling={false}
                    placeholder={"Select Your Dates"}
                    mode={"range"}
                  />
                </TouchableOpacity>

                <Pressable
                  onPress={() => setModalVisible(!modalVisible)}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    backgroundColor: themeColors.bg_Disabled,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 15, color: themeColors.black }}>
                    {getRoomPlaceholder(options.room, options.person)}
                  </Text>
                </Pressable>

                <View
                  style={{
                    width: "100%",
                    height: 0.5,
                    borderWidth: 0.2,
                    borderColor: themeColors.gray,
                  }}
                ></View>
              </View>

              <View
                style={{
                  gap: 8,
                  borderWidth: 1,
                  borderColor: themeColors.gray,
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: themeColors.title,
                  }}
                >
                  Price Details
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Room
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {formatPrice(
                      Math.ceil(priceRoom * dayNights * options.room)
                    )}{" "}
                    VND
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 0.5,
                    borderWidth: 0.2,
                    borderColor: themeColors.gray,
                  }}
                ></View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Service Fee
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {formatPrice(Math.ceil(serviceFee))} VND
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 0.5,
                    borderWidth: 0.2,
                    borderColor: themeColors.gray,
                  }}
                ></View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Taxes
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {formatPrice(Math.ceil(taxesPrice))} VND
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 0.5,
                    borderWidth: 0.2,
                    borderColor: themeColors.gray,
                  }}
                ></View>

                {selectedUseVoucher && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "400",
                          color: themeColors.black,
                        }}
                      >
                        Voucher
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "400",
                          color: themeColors.error,
                        }}
                      >
                        {voucherPrice > 0
                          ? `- ${formatPrice(Math.ceil(voucherPrice))} VND`
                          : `${formatPrice(Math.ceil(voucherPrice))} VND`}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: "100%",
                        height: 0.5,
                        borderWidth: 0.2,
                        borderColor: themeColors.gray,
                      }}
                    ></View>
                  </>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Total Price
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "500",
                      color: themeColors.title,
                    }}
                  >
                    {voucherPrice
                      ? `${formatPrice(
                          Math.ceil(
                            priceRoom * dayNights * options.room +
                              serviceFee +
                              taxesPrice -
                              voucherPrice
                          )
                        )}`
                      : `${formatPrice(
                          Math.ceil(
                            priceRoom * dayNights * options.room +
                              serviceFee +
                              taxesPrice
                          )
                        )}`}{" "}
                    VND
                  </Text>
                </View>
              </View>

              <TouchableOpacity>
                <SelectDropdown
                  data={removeSelectedVoucher}
                  onSelect={(selectedItem, index) => {
                    if (selectedItem?.code === "Remove Selected Voucher") {
                      setSelectedUseVoucher(null);
                    } else {
                      setSelectedUseVoucher(selectedItem);
                    }
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {selectedItem
                            ? selectedItem?.code === "Remove Selected Voucher"
                              ? "Select Use Voucher"
                              : `${selectedItem?.code} - ${selectedItem?.discount}%`
                            : "Select Use Voucher"}
                        </Text>
                        <AntDesign
                          name={isOpened ? "down" : "up"}
                          size={14}
                          color={themeColors.gray}
                        />
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View
                        key={index}
                        style={{
                          ...styles.dropdownItemStyle,
                          ...(isSelected && {
                            backgroundColor: themeColors.bkgPage,
                          }),
                        }}
                      >
                        <Text key={index} style={styles.dropdownItemTxtStyle}>
                          {item?.code === "Remove Selected Voucher"
                            ? item?.code
                            : `${item?.code} - ${item?.discount}%`}
                        </Text>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              backgroundColor: themeColors.white,
              borderRadius: 8,
              shadowColor: themeColors.boxShadowHover,
              elevation: 4,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: themeColors.title,
              }}
            >
              Booker's Information
            </Text>

            <View style={{ marginTop: 8, gap: 10 }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "400",
                    color: themeColors.black,
                  }}
                >
                  Full Name
                </Text>
                <TextInput
                  value={
                    account?.profile?.fullName
                      ? account?.profile?.fullName
                      : "-"
                  }
                  editable={false}
                  style={{
                    width: "100%",
                    backgroundColor: themeColors.bg_Disabled,
                    fontSize: 15,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    color: themeColors.text_Disabled,
                    borderRadius: 6,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "400",
                    color: themeColors.black,
                  }}
                >
                  Email
                </Text>
                {account?.email ? (
                  <TextInput
                    value={account?.email}
                    editable={false}
                    style={{
                      width: "100%",
                      backgroundColor: themeColors.bg_Disabled,
                      fontSize: 15,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      color: themeColors.text_Disabled,
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <TextInput
                    editable={false}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    style={{
                      width: "100%",
                      backgroundColor: themeColors.bg_Disabled,
                      fontSize: 15,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      color: themeColors.text_Disabled,
                      borderRadius: 6,
                    }}
                  />
                )}
              </View>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "400",
                    color: themeColors.black,
                  }}
                >
                  Phone
                </Text>
                {account?.phone ? (
                  <TextInput
                    value={formatPhoneNumber(account?.phone)}
                    editable={false}
                    style={{
                      width: "100%",
                      backgroundColor: themeColors.bg_Disabled,
                      fontSize: 15,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      color: themeColors.text_Disabled,
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <TextInput
                    editable={false}
                    keyboardType="numeric"
                    value={phone}
                    onChangeText={setPhone}
                    style={{
                      width: "100%",
                      backgroundColor: themeColors.bg_Disabled,
                      fontSize: 15,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      color: themeColors.text_Disabled,
                      borderRadius: 6,
                    }}
                  />
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              backgroundColor: themeColors.white,
              borderRadius: 8,
              shadowColor: themeColors.boxShadowHover,
              elevation: 4,
              shadowOffset: { width: -2, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: themeColors.title,
              }}
            >
              Note
            </Text>
            <Text style={{ fontSize: 15, color: themeColors.black }}>
              For the room type you selected, check-in is from 12:00 to 24:00
              and check-out is before 12:00.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )}

      <BottomModal
        swipeThreshold={200}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        footer={
          <ModalFooter>
            <ModalButton
              text="Apply"
              textStyle={{
                color: themeColors.white,
                fontSize: 20,
                fontWeight: "500",
              }}
              style={{
                backgroundColor: themeColors.primary_Default,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            />
          </ModalFooter>
        }
        modalTitle={
          <ModalTitle
            textStyle={{ color: themeColors.title, fontWeight: "500" }}
            title="Select rooms and persons"
          />
        }
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 120 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Room</Text>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                onPress={() => handleOption("room", "d")}
                disabled={options.room <= 1}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Pressable>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                    paddingHorizontal: 6,
                  }}
                >
                  {options.room}
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => handleOption("room", "i")}
                disabled={options.room === room?.quantity}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 12,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Person</Text>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <TouchableOpacity
                onPress={() => handleOption("person", "d")}
                disabled={options.person <= 1}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>
              <Pressable>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                    paddingHorizontal: 6,
                  }}
                >
                  {options.person}
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => handleOption("person", "i")}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  +
                </Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </ModalContent>
      </BottomModal>

      <View
        style={{
          backgroundColor: themeColors.white,
          shadowColor: themeColors.boxShadowHover,
          elevation: 4,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          padding: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <TouchableOpacity onPress={() => handleSelectedCheckbox()}>
            {!checkAccept ? (
              <Fontisto
                name="checkbox-passive"
                size={18}
                color={themeColors.black}
              />
            ) : (
              <Fontisto
                name="checkbox-active"
                size={18}
                color={themeColors.black}
              />
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 15, color: themeColors.black }}>
            I agree to the{" "}
            <Text
              style={{
                color: themeColors.text_Link,
                textDecorationLine: "underline",
              }}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={{
                color: themeColors.text_Link,
                textDecorationLine: "underline",
              }}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={
            !account?.phone || !account?.email
              ? handleUpdateProfile
              : handleBooking
          }
          style={{
            marginTop: 8,
            width: "100%",
            backgroundColor: themeColors.primary_600,
            paddingVertical: 10,
            borderRadius: 4,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "500",
              color: themeColors.white,
            }}
          >
            Booking
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateBookingLayout;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: pixelNormalize(40),
    backgroundColor: themeColors.bg_Disabled,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    color: themeColors.black,
  },

  dropdownMenuStyle: {
    backgroundColor: themeColors.white,
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: themeColors.black,
  },
});
