import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { pixelNormalize } from "../../../../components/Normalize";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  formatDateMonthAndDay,
  formatDesc,
  renderStars,
} from "../../../../utils/helper";
import { useNavigation } from "@react-navigation/native";
import { getFeedbackByHotelId } from "../../Hotel.Api";
import { URL_IMAGE } from "../../../../services/ApiUrl";

const HotelDetailGuest_Reviews = ({ hotelId }) => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const listFeedback = data?.listReview;
  const { width, height } = Dimensions.get("window");

  const init = async () => {
    const res = await getFeedbackByHotelId(hotelId);
    if (res) {
      setData(res);
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
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            backgroundColor: themeColors.white,
            borderRadius: 8,
            shadowColor: themeColors.boxShadowHover,
            eelevation: 4,
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: themeColors.title,
                }}
              >
                Customer Reviews
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: themeColors.black,
                  }}
                >
                  Total Rating:
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: themeColors.title,
                  }}
                >
                  {data?.avgRating?.toFixed(1)}/5
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  color: themeColors.black,
                }}
              >
                What customers love most:
              </Text>
            </View>

            {listFeedback?.slice(0, 10).map((item, index) => (
              <View
                key={index}
                style={{
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    width: "100%",
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
                      width: "60%",
                    }}
                  >
                    <View
                      style={{
                        width: pixelNormalize(40),
                        height: pixelNormalize(40),
                        borderRadius: pixelNormalize(50),
                        overflow: "hidden",
                        borderWidth: 0.5,
                        borderColor: themeColors.black,
                      }}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        source={
                          item?.profile?.avatar?.startsWith("/", 0)
                            ? { uri: `${URL_IMAGE}${item?.profile?.avatar}` }
                            : item?.profile?.avatar?.includes("https")
                            ? { uri: `${item?.profile?.avatar}` }
                            : require("../../../../assets/logo.png")
                        }
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: themeColors.black,
                      }}
                    >
                      {item?.profile?.fullName}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <AntDesign
                      name="calendar"
                      size={22}
                      color={themeColors.gray}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: themeColors.gray,
                      }}
                    >
                      {formatDateMonthAndDay(item?.booking?.checkInDate)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 6,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="bed-outline"
                      size={22}
                      color={themeColors.gray}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        color: themeColors.gray,
                      }}
                    >
                      {item?.room?.typeOfRoom}
                    </Text>
                  </View>

                  <Text
                    style={{
                      paddingHorizontal: 8,
                      marginBottom: 6,
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    Rating:
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: themeColors.black,
                      }}
                    >
                      {" "}
                      {renderStars(item?.rating)}
                    </Text>
                  </Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      color: themeColors.black,
                    }}
                  >
                    {formatDesc(item?.description)}
                  </Text>
                </View>

                <View style={{ paddingVertical: 8 }}>
                  <Image
                    style={{
                      width: width - 50,
                      height: height / 3.5,
                      borderRadius: pixelNormalize(8),
                    }}
                    source={{
                      uri: `${URL_IMAGE}${item?.image}`,
                    }}
                  />
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
            ))}

            {listFeedback?.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Guest_Reviews", { hotelId: hotelId })
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: themeColors.text_Link,
                    }}
                  >
                    See All Reviews & Rating
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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

export default HotelDetailGuest_Reviews;

const styles = StyleSheet.create({});
