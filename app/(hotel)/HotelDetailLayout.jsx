import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import HeaderNormal from "../../components/HeaderNormal";
import { fakeHotels } from "../../utils/fake/data";
import { themeColors } from "../../utils/theme/ThemeColor";
import { formatPrice, renderStars } from "../../utils/helper";
import {
  Entypo,
  Fontisto,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { pixelNormalize } from "../../components/Normalize";
import HotelDetailDescription from "./components/hotelDetails/HotelDetailDescription";
import HotelDetailRooms from "./components/hotelDetails/HotelDetailRooms";
import HotelDetailGuest_Reviews from "./components/hotelDetails/HotelDetailGuest_Reviews";
import HotelDetailService_Amenities from "./components/hotelDetails/HotelDetailService_Amenities";
import { getHotelDetails } from "./Hotel.Api";
import { URL_IMAGE } from "../../services/ApiUrl";

const HotelDetails = ({ navigation, route }) => {
  const navItems = [
    "Description",
    "Rooms",
    "Guest Reviews",
    "Services & Amenities",
  ];

  const [isSelectNavItem, setSelectNavItem] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [itemWidths, setItemWidths] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const ScrollRef = useRef(null);
  const itemRefs = useRef([]);

  const { hotelId } = route.params;

  const init = async () => {
    const res = await getHotelDetails(hotelId);
    if (res) {
      setData(res);
      setLoading(true);
    }
    setLoading(false);
  };

  const findMinPrice = (dataHotel) => {
    let minPrice = Infinity;

    dataHotel?.rooms?.forEach((room) => {
      if (room?.quantity > 0 && room?.price < minPrice) {
        minPrice = room?.price;
      }
    });

    return minPrice === Infinity ? null : minPrice;
  };

  const { width, height } = Dimensions.get("window");

  const header = HeaderNormal({
    title: `${data?.name || "Hotel Details"}`,
  });

  const handleSelectedNav = (index) => {
    setSelectNavItem(index);
    setActiveIndex(index);

    const visibleItems = 2; // Number of items to show in a row
    const totalItems = navItems.length;

    // Calculate the offset to scroll to
    const totalWidth = itemWidths.reduce((acc, width) => acc + width, 0);
    const visibleWidth = itemWidths
      .slice(0, visibleItems)
      .reduce((acc, width) => acc + width, 0);
    const maxScroll = Math.max(totalWidth - visibleWidth, 0);

    // Determine the offset for the selected index
    let offset = 0;
    if (index >= 1) {
      offset = itemWidths
        .slice(0, index)
        .reduce((acc, width) => acc + width, 0);
      if (index === totalItems - 1) {
        // For the last item, ensure the previous item is fully visible
        offset = itemWidths
          .slice(0, index - 1)
          .reduce((acc, width) => acc + width, 0);
      } else {
        // Ensure the selected item and the next item are fully visible
        offset = itemWidths
          .slice(0, index - 1)
          .reduce((acc, width) => acc + width, 0);
      }
    }

    // Ensure the offset does not exceed the maximum scroll
    offset = Math.min(offset, maxScroll);

    // Perform the scroll
    ScrollRef.current.scrollTo({
      x: offset,
      animated: true,
    });
  };

  const handleItemLayout = (index, event) => {
    const { width } = event.nativeEvent.layout;
    setItemWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  };

  const handleSeeMore = () => {
    handleSelectedNav(3);

    itemRefs.current[3].measureLayout(
      ScrollRef.current,
      (x, y, width, height) => {
        ScrollRef.current.scrollTo({
          x: x - 10,
          animated: true,
        });
      }
    );
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [isSelectNavItem]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 2500);

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
                  maxWidth: "52%",
                  minWidth: "52%",
                }}
              >
                {data?.name}
              </Text>
              <Text
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: themeColors.title,
                }}
              >
                {formatPrice(findMinPrice(data))} VND
              </Text>
            </View>

            <View style={{ marginTop: 6, flexDirection: "row", gap: 4 }}>
              {renderStars(data?.hotelStandar)}
            </View>

            <View
              style={{
                marginTop: 6,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
                onPress={() =>
                  navigation.navigate("Map", {
                    hotelId: hotelId,
                    latitude: data?.hotelAddress?.latitude,
                    longitude: data?.hotelAddress?.longitude,
                  })
                }
              >
                <Fontisto
                  name="map-marker-alt"
                  size={20}
                  color={themeColors.primary_600}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "400",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    paddingRight: 6,
                    maxWidth: "90%",
                    minWidth: "90%",
                  }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {data?.hotelAddress?.address}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 6 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Galleries", {
                    hotelId: hotelId,
                  })
                }
              >
                <Image
                  style={{
                    width: width - 50,
                    height: height / 3.5,
                    borderRadius: pixelNormalize(8),
                  }}
                  source={{
                    uri: `${URL_IMAGE}${data?.mainImage}`,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 20,
                  marginTop: 10,
                  paddingHorizontal: 2,
                }}
              >
                {fakeHotels?.service.slice(0, 3)?.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      borderWidth: 2,
                      padding: 6,
                      borderColor: themeColors.primary_600,
                      borderRadius: 4,
                      flex: fakeHotels?.service?.length === 3 ? 1 : undefined,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={item?.iconName}
                      size={20}
                      color="black"
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: themeColors.black,
                      }}
                    >
                      {item?.type}
                    </Text>
                  </Pressable>
                ))}

                {fakeHotels?.service?.length > 3 && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      borderWidth: 2,
                      padding: 6,
                      borderColor: themeColors.primary_600,
                      borderRadius: 4,
                    }}
                    onPress={handleSeeMore}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color={themeColors.text_Link}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "400",
                        color: themeColors.text_Link,
                      }}
                    >
                      See More
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
            }}
          >
            <ScrollView
              ref={ScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 10,
                paddingHorizontal: 2,
              }}
            >
              {navItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor:
                      index === isSelectNavItem
                        ? themeColors.primary_Default
                        : themeColors.white,
                    borderRadius: 8,
                    shadowColor: themeColors.boxShadowHover,
                    elevation: 4,
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                  }}
                  aria-valuetext={activeIndex}
                  onPress={() => handleSelectedNav(index)}
                  onLayout={(event) => handleItemLayout(index, event)}
                  ref={(ref) => (itemRefs.current[index] = ref)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: index === isSelectNavItem ? "700" : "normal",
                      color:
                        index === isSelectNavItem
                          ? themeColors.white
                          : themeColors.black,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ marginTop: 10 }}>
            {isSelectNavItem === 0 ? (
              <HotelDetailDescription hotelId={hotelId} />
            ) : null}
            {isSelectNavItem === 1 ? (
              <HotelDetailRooms hotelId={hotelId} />
            ) : null}
            {isSelectNavItem === 2 ? (
              <HotelDetailGuest_Reviews hotelId={hotelId} />
            ) : null}
            {isSelectNavItem === 3 ? (
              <HotelDetailService_Amenities hotelId={hotelId} />
            ) : null}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HotelDetails;

const styles = StyleSheet.create({});
