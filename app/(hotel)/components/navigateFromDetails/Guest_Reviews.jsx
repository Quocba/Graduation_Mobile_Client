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
import HeaderNormal from "../../../../components/HeaderNormal";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { pixelNormalize } from "../../../../components/Normalize";
import {
  formatDateMonthAndDay,
  formatDesc,
  renderStars,
} from "../../../../utils/helper";
import { getFeedbackByHotelId, getHotelDetails } from "../../Hotel.Api";
import { useRoute } from "@react-navigation/native";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { getAllRoom } from "../../../(room)/Room.Api";

const Guest_Reviews = ({ navigation }) => {
  const route = useRoute();
  const { hotelId } = route.params;
  const { width, height } = Dimensions.get("window");

  const [data, setData] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [valueType, setValueType] = useState([]);

  const [selectedRatings, setSelectedRatings] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [matchingRooms, setMatchingRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const listFeedback = data?.listReview ?? [];

  const init = async () => {
    try {
      const res = await getFeedbackByHotelId(hotelId);
      if (res) {
        setData(res);
        setFilteredFeedback(res?.listReview ?? []);
      }

      const hotelRes = await getHotelDetails(hotelId);
      if (hotelRes) {
        setHotelName(hotelRes?.name);
      }

      const resRoom = await getAllRoom(hotelId);
      if (resRoom) {
        setValueType(resRoom);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  const fixedRatings = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    id: `rating-${rating}`,
  }));

  const removeSelectedRating = [
    ...fixedRatings,
    { rating: "Remove Selected Rating" },
  ];

  const removeSelectedRoom = [
    ...valueType?.map((item) => ({
      typeOfRoom: item?.typeOfRoom,
      id: item?.roomID,
    })),
    { typeOfRoom: "Remove Selected Room" },
  ];

  const filterFeedback = () => {
    let filtered = listFeedback;

    if (selectedRatings) {
      filtered = filtered.filter(
        (item) => item?.rating === selectedRatings?.rating
      );
    }

    if (selectedRooms) {
      filtered = filtered.filter(
        (item) => item?.room?.typeOfRoom === selectedRooms?.typeOfRoom
      );

      // Tạo map từ typeOfRoom tới roomID
      const typeOfRoomToRoomIdMap = new Map();
      valueType.forEach((room) => {
        typeOfRoomToRoomIdMap.set(room?.typeOfRoom, room?.roomID);
      });

      // Tìm kiếm các phòng trùng khớp trong listFeedback
      const matching = listFeedback
        .map((feedback) => feedback?.room?.typeOfRoom)
        .filter((typeOfRoom, index, self) => self.indexOf(typeOfRoom) === index)
        .map((typeOfRoom) => ({
          typeOfRoom,
          roomID: typeOfRoomToRoomIdMap.get(typeOfRoom) || null,
        }))
        .filter((room) => room?.roomID !== null);

      setMatchingRooms(matching);
    }
    setFilteredFeedback(filtered);
  };

  const handleSelectRoom = () => {
    if (selectedRooms) {
      const selectedRoomType = selectedRooms?.typeOfRoom;
      const matchingRoom = matchingRooms.find(
        (room) => room?.typeOfRoom === selectedRoomType
      );

      if (matchingRoom && hotelId) {
        const { roomID, typeOfRoom } = matchingRoom;
        if (roomID) {
          navigation.navigate("Room", {
            roomId: roomID,
            typeOfRoom,
            hotelId,
          });
        } else {
          console.error("Room ID is undefined.");
        }
      } else {
        Alert.alert(
          "Invalid Room",
          "No matching room beacause filter not found !",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ],
          { cancelable: false }
        );
      }
    } else {
      Alert.alert(
        "Invalid Room",
        "Please selected from filter room !",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
  };

  const header = HeaderNormal({
    title: hotelName,
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 1500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    filterFeedback();
  }, [selectedRatings, selectedRooms]);

  useEffect(() => {}, [matchingRooms]);

  useLayoutEffect(() => {
    navigation.setOptions(header.setHeaderOptions());
  }, [navigation, header]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bkgPage }}>
      <ScrollView
        vertical
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            padding: 10,
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
              color: themeColors.black,
            }}
          >
            Customer reviews for
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: themeColors.title,
              }}
            >
              {" "}
              {hotelName}
            </Text>
          </Text>

          <View style={{ marginTop: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: themeColors.black,
              }}
            >
              Total Rating:{" "}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: themeColors.title,
                }}
              >
                {data?.avgRating?.toFixed(1)}/5
              </Text>
            </Text>
          </View>

          <View
            style={{
              marginTop: 6,
              backgroundColor: themeColors.bg_Disabled,
              borderRadius: 4,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: themeColors.black,
              }}
            >
              Filter By:
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 6,
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <SelectDropdown
                data={removeSelectedRating}
                onSelect={(selectedItem, index) => {
                  if (selectedItem?.rating === "Remove Selected Rating") {
                    setSelectedRatings(null);
                  } else {
                    setSelectedRatings(selectedItem);
                  }
                  filterFeedback();
                }}
                defaultValue={selectedRatings}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {selectedItem
                          ? selectedItem?.rating === "Remove Selected Rating"
                            ? "All Ratings"
                            : selectedItem?.rating === 1
                            ? "1 star"
                            : null || selectedItem?.rating === 2
                            ? "2 stars"
                            : null || selectedItem?.rating === 3
                            ? "3 stars"
                            : null || selectedItem?.rating === 4
                            ? "4 stars"
                            : null || selectedItem?.rating === 5
                            ? "5 stars"
                            : null
                          : "All Ratings"}
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
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item?.rating === "Remove Selected Rating"
                          ? "Remove Selected Rating"
                          : item?.rating === 1
                          ? "1 star"
                          : null || item?.rating === 2
                          ? "2 stars"
                          : null || item?.rating === 3
                          ? "3 stars"
                          : null || item?.rating === 4
                          ? "4 stars"
                          : null || item?.rating === 5
                          ? "5 stars"
                          : null}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />

              <SelectDropdown
                data={removeSelectedRoom}
                onSelect={(selectedItem, index) => {
                  if (selectedItem?.typeOfRoom === "Remove Selected Room") {
                    setSelectedRooms(null);
                  } else {
                    setSelectedRooms(selectedItem);
                  }
                  filterFeedback();
                }}
                defaultValue={selectedRooms}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {selectedItem
                          ? selectedItem?.typeOfRoom === "Remove Selected Room"
                            ? "All Rooms"
                            : selectedItem?.typeOfRoom
                          : "All Rooms"}
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
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item?.typeOfRoom}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 6 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                color: themeColors.black,
              }}
            >
              What Customer Love Most:
            </Text>

            {loading ? (
              <>
                {filteredFeedback?.map((item, index) => (
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
                                ? {
                                    uri: `${URL_IMAGE}${item?.profile?.avatar}`,
                                  }
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

                    {item?.image && (
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
                    )}

                    {index < filteredFeedback?.length - 1 && (
                      <View
                        style={{
                          marginTop: 6,
                          width: "100%",
                          height: 0.5,
                          borderWidth: 0.2,
                          borderColor: themeColors.gray,
                        }}
                      ></View>
                    )}
                  </View>
                ))}

                {filteredFeedback?.length === 0 && (
                  <View
                    style={{
                      paddingVertical: 20,
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "500",
                        color: themeColors.title,
                      }}
                    >
                      No reviews found!
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  paddingVertical: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color={themeColors.primary} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleSelectRoom}
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
          Select Room
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Guest_Reviews;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: pixelNormalize(35),
    backgroundColor: themeColors.white,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: themeColors.gray,
  },

  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: themeColors.gray,
    fontStyle: "italic",
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
