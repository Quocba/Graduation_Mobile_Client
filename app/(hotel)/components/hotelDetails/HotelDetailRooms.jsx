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
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { pixelNormalize } from "../../../../components/Normalize";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { images } from "../../../../constants";
import { capitalizeFirstLetter, formatPrice } from "../../../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import { getAllRoom } from "../../../(room)/Room.Api";
import { URL_IMAGE } from "../../../../services/ApiUrl";

const HotelDetailRooms = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  const init = async () => {
    const room = await getAllRoom(hotelId);
    if (room) {
      setRooms(room);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bkgPage }}>
      {loading ? (
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          {rooms.map((item, index) => {
            if (item?.quantity > 0) {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: themeColors.white,
                    padding: 10,
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
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: themeColors.title,
                        width: "75%",
                      }}
                    >
                      {item?.typeOfRoom
                        ? capitalizeFirstLetter(item?.typeOfRoom)
                        : ""}
                    </Text>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() =>
                        navigation.navigate("Room", {
                          roomId: item?.roomID,
                          hotelId: hotelId,
                        })
                      }
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: themeColors.text_Link,
                        }}
                      >
                        Room Detail
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {item?.roomImages?.slice(0, 1).map((images, index) => (
                    <View
                      style={{
                        marginTop: 8,
                      }}
                      key={index}
                    >
                      <Image
                        style={{
                          width: width - 50,
                          height: height / 3.8,
                          borderRadius: pixelNormalize(8),
                        }}
                        source={{
                          uri: `${URL_IMAGE}${images?.image}`,
                        }}
                      />
                    </View>
                  ))}

                  <View
                    style={{
                      marginTop: 10,
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                            fontSize: 14,
                            color: themeColors.black,
                          }}
                        >
                          {item?.numberOfBed} {""}
                          {item?.typeOfBed}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color={themeColors.gray}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: themeColors.black,
                          }}
                        >
                          {item?.numberCapacity <= 1
                            ? `${item?.numberCapacity} person`
                            : `${item?.numberCapacity} people`}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Image
                          source={images.surFace}
                          style={{
                            width: 20,
                            height: 20,
                            color: themeColors.gray,
                          }}
                        />
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: themeColors.black,
                            }}
                          >
                            {item?.sizeOfRoom} m
                          </Text>
                          <Text style={{ fontSize: 12, lineHeight: 12 }}>
                            2
                          </Text>
                        </View>
                      </View>
                    </View>

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
                          gap: 20,
                          paddingHorizontal: 0,
                        }}
                      >
                        {item?.roomServices?.slice(0, 4)?.map((service) =>
                          service?.type === "Toiletries" ? (
                            <View
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 2,
                                borderColor: themeColors.primary_600,
                                borderRadius: 4,
                              }}
                              key={service?.roomServiceID}
                            >
                              <MaterialCommunityIcons
                                name="toilet"
                                size={24}
                                color={themeColors.gray}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: themeColors.black,
                                }}
                              >
                                {service?.type}
                              </Text>
                            </View>
                          ) : service?.type ===
                            "Room Layout and Furnishings" ? (
                            <View
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 2,
                                borderColor: themeColors.primary_600,
                                borderRadius: 4,
                              }}
                              key={service?.roomServiceID}
                            >
                              <MaterialCommunityIcons
                                name="room-service-outline"
                                size={24}
                                color={themeColors.gray}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: themeColors.black,
                                }}
                              >
                                {service?.type}
                              </Text>
                            </View>
                          ) : service?.type === "Cleaning Services" ? (
                            <View
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 2,
                                borderColor: themeColors.primary_600,
                                borderRadius: 4,
                              }}
                              key={service?.roomServiceID}
                            >
                              <MaterialIcons
                                name="cleaning-services"
                                size={24}
                                color={themeColors.gray}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: themeColors.black,
                                }}
                              >
                                {service?.type}
                              </Text>
                            </View>
                          ) : service?.type === "Bathroom facilities" ||
                            service?.type === "Bathroom Facilities" ? (
                            <View
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 2,
                                borderColor: themeColors.primary_600,
                                borderRadius: 4,
                              }}
                              key={service?.roomServiceID}
                            >
                              <MaterialCommunityIcons
                                name="bathtub-outline"
                                size={24}
                                color={themeColors.gray}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: themeColors.black,
                                }}
                              >
                                {service?.type}
                              </Text>
                            </View>
                          ) : service?.type === "Outdoor View" ? (
                            <View
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 2,
                                borderColor: themeColors.primary_600,
                                borderRadius: 4,
                              }}
                              key={service?.roomServiceID}
                            >
                              <MaterialCommunityIcons
                                name="pool"
                                size={24}
                                color={themeColors.gray}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: themeColors.black,
                                }}
                              >
                                {service?.type}
                              </Text>
                            </View>
                          ) : service?.type === "Food & Drinks" ? (
                            <View
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 6,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 2,
                                borderColor: themeColors.primary_600,
                                borderRadius: 4,
                              }}
                              key={service?.roomServiceID}
                            >
                              <MaterialCommunityIcons
                                name="food-drumstick-outline"
                                size={24}
                                color={themeColors.gray}
                              />
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: themeColors.black,
                                }}
                              >
                                {service?.type}
                              </Text>
                            </View>
                          ) : null
                        )}
                      </ScrollView>
                    </View>

                    <View
                      style={{
                        marginTop: 6,
                        width: "100%",
                        height: 0.5,
                        borderWidth: 0.2,
                        borderColor: themeColors.gray,
                      }}
                    ></View>
                  </View>

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
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
                          fontSize: 15,
                          fontWeight: "500",
                          color: themeColors.text_Link,
                        }}
                      >
                        Free cancelation
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "400",
                            color: themeColors.black,
                          }}
                        >
                          {" "}
                          24 hours in advance
                        </Text>
                      </Text>

                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "400",
                          color: themeColors.black,
                        }}
                      >
                        Pay at the
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: themeColors.text_Link,
                          }}
                        >
                          {" "}
                          front desk
                        </Text>
                      </Text>
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
                          fontSize: 18,
                          fontWeight: "500",
                          color: themeColors.title,
                        }}
                      >
                        {formatPrice(getCurrentPrice(item))} VND
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("Booking", {
                            hotelId: hotelId,
                            roomId: item?.roomID,
                          });
                        }}
                        style={{
                          backgroundColor: themeColors.primary_Default,
                          paddingVertical: 10,
                          paddingHorizontal: "41.3%",
                          borderRadius: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: themeColors.white,
                          }}
                        >
                          Reserve
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            } else {
              return null;
            }
          })}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HotelDetailRooms;

const styles = StyleSheet.create({});
