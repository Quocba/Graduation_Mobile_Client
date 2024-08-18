import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { getAllAmenitiesByHotelId } from "../../Hotel.Api";

const HotelDetailService_Amenities = ({ hotelId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const init = async () => {
    const res = await getAllAmenitiesByHotelId(hotelId);
    if (res) {
      setServices(res);
    }
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
            padding: 10,
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            backgroundColor: themeColors.white,
            borderRadius: 8,
            shadowColor: themeColors.boxShadowHover,
            elevation: 4,
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: themeColors.title,
            }}
          >
            Hotel Amenities
          </Text>

          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 30,
            }}
          >
            {services.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 15,
                }}
              >
                {item?.type === "Standard" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="hair-dryer-outline"
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Entrance" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="bell-outline"
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Kitchen" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="fridge-outline"
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Bathroom" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Entertainment" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="gamepad-square-outline"
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Family" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="baby-bottle-outline"
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Safety and cleanliness" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="recycle-variant"
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Others" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
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
                      {item?.type}
                    </Text>
                  </View>
                ) : item?.type === "Outside" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="bicycle"
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
                      {item?.type}
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
                    contentContainerStyle={{ gap: 30, paddingHorizontal: 5 }}
                  >
                    {item?.subServices?.map((subService, subIndex) => (
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
                          {subService?.subServiceName}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
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

export default HotelDetailService_Amenities;

const styles = StyleSheet.create({});
