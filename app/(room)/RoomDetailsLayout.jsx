import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import HeaderNormal from "../../components/HeaderNormal";
import { themeColors } from "../../utils/theme/ThemeColor";
import { pixelNormalize } from "../../components/Normalize";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import { images } from "../../constants";
import { capitalizeFirstLetter, formatPrice } from "../../utils/helper";
import { getRoomDetails } from "./Room.Api";
import { URL_IMAGE } from "../../services/ApiUrl";

const RoomDetailsLayout = ({ navigation, route }) => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { roomId, hotelId } = route.params;

  const init = async () => {
    const roomRes = await getRoomDetails(roomId);
    if (roomRes) {
      setRoomDetails(roomRes);
    }
  };

  const getCurrentPrice = (room) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (room?.specialPrice && room?.specialPrice.length > 0) {
      const specialPrice = room?.specialPrice.find((price) => {
        const startDate = new Date(price?.startDate);
        const endDate = new Date(price?.endDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return startDate <= today && endDate >= today;
      });
      return specialPrice ? specialPrice?.price : room?.price;
    }
    return room?.price;
  };

  const { width, height } = Dimensions.get("window");

  const header = HeaderNormal({
    title: `${
      roomDetails?.typeOfRoom
        ? capitalizeFirstLetter(roomDetails?.typeOfRoom)
        : "Room Details"
    }`,
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

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
            }}
          >
            <View
              style={{
                gap: 8,
              }}
            >
              {roomDetails?.roomImages?.slice(0, 1).map((images) => (
                <Image
                  key={images?.imageID}
                  style={{
                    width: width - 30,
                    height: height / 3.5,
                    borderTopLeftRadius: pixelNormalize(8),
                    borderTopRightRadius: pixelNormalize(8),
                  }}
                  source={{
                    uri: `${URL_IMAGE}${images?.image}`,
                  }}
                />
              ))}

              <View
                style={{
                  paddingHorizontal: 10,
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
                  {roomDetails?.typeOfRoom
                    ? capitalizeFirstLetter(roomDetails?.typeOfRoom)
                    : ""}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Capacity:{" "}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: themeColors.gray,
                      }}
                    >
                      {roomDetails?.numberCapacity <= 1
                        ? `${roomDetails?.numberCapacity} person`
                        : `${roomDetails?.numberCapacity} people`}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Quantity:{" "}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: themeColors.gray,
                      }}
                    >
                      {roomDetails?.quantity <= 1
                        ? `${roomDetails?.quantity} room`
                        : `${roomDetails?.quantity} rooms`}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 30,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name="bed-outline"
                      size={24}
                      color={themeColors.gray}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: themeColors.black,
                      }}
                    >
                      {roomDetails?.numberOfBed} {roomDetails?.typeOfBed}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      color={themeColors.gray}
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
                        fontWeight: "500",
                        color: themeColors.gray,
                      }}
                    >
                      Size:{" "}
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: themeColors.black,
                        }}
                      >
                        {roomDetails?.sizeOfRoom} m
                      </Text>
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 12,
                        fontWeight: "500",
                      }}
                    >
                      2
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: themeColors.title,
                  }}
                >
                  {formatPrice(getCurrentPrice(roomDetails))} VND
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  width: "94%",
                  height: 0.5,
                  borderWidth: 0.2,
                  borderColor: themeColors.gray,
                }}
              ></View>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: themeColors.black,
                }}
              >
                Amenities
              </Text>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 30,
                }}
              >
                {roomDetails?.roomService.map((services, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 20,
                    }}
                  >
                    {services?.type === "Toiletries" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        key={services?.roomServiceID}
                      >
                        <MaterialCommunityIcons
                          name="toilet"
                          size={28}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: themeColors.black,
                          }}
                        >
                          {services?.type}
                        </Text>
                      </View>
                    ) : services?.type === "Room Layout and Furnishings" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        key={services?.roomServiceID}
                      >
                        <MaterialCommunityIcons
                          name="room-service-outline"
                          size={28}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: themeColors.black,
                          }}
                        >
                          {services?.type}
                        </Text>
                      </View>
                    ) : services?.type === "Cleaning Services" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        key={services?.roomServiceID}
                      >
                        <MaterialIcons
                          name="cleaning-services"
                          size={28}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: themeColors.black,
                          }}
                        >
                          {services?.type}
                        </Text>
                      </View>
                    ) : services?.type === "Bathroom facilities" ||
                      services?.type === "Bathroom Facilities" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        key={services?.roomServiceID}
                      >
                        <MaterialCommunityIcons
                          name="bathtub-outline"
                          size={28}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: themeColors.black,
                          }}
                        >
                          {services?.type}
                        </Text>
                      </View>
                    ) : services?.type === "Outdoor View" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        key={services?.roomServiceID}
                      >
                        <MaterialCommunityIcons
                          name="pool"
                          size={28}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: themeColors.black,
                          }}
                        >
                          {services?.type}
                        </Text>
                      </View>
                    ) : services?.type === "Food & Drinks" ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                        key={services?.roomServiceID}
                      >
                        <MaterialCommunityIcons
                          name="food-drumstick-outline"
                          size={28}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: themeColors.black,
                          }}
                        >
                          {services?.type}
                        </Text>
                      </View>
                    ) : null}

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          gap: 25,
                          paddingHorizontal: 5,
                        }}
                      >
                        {services?.roomSubServices?.map(
                          (subService, subIndex) => (
                            <View
                              key={subIndex}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <FontAwesome6
                                name="check-circle"
                                size={20}
                                color={themeColors.black}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "400",
                                  color: themeColors.black,
                                }}
                              >
                                {subService.subName}
                              </Text>
                            </View>
                          )
                        )}
                      </ScrollView>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          if (roomDetails?.quantity <= 0) {
            Alert.alert(
              "Room Unavailable",
              "This room is fully booked. Please select a different hotel.",
              [
                {
                  text: "OK",
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "HomeLayout" }],
                    }),
                },
              ],
              { cancelable: false }
            );
          } else {
            navigation.navigate("Booking", {
              hotelId: hotelId,
              roomId: roomId,
            });
          }
        }}
        style={{
          marginBottom: 10,
          backgroundColor: themeColors.primary_600,
          padding: 10,
          width: "95%",
          marginHorizontal: 10,
          borderRadius: 4,
          elevation: 4,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "400",
            fontSize: 16,
          }}
        >
          Reserve Room
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RoomDetailsLayout;

const styles = StyleSheet.create({});
