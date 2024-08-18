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
import { useRoute } from "@react-navigation/native";
import HeaderNormal from "../../../../components/HeaderNormal";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { pixelNormalize } from "../../../../components/Normalize";
import { getHotelDetails } from "../../Hotel.Api";
import { URL_IMAGE } from "../../../../services/ApiUrl";

const navTitleImage = ["Hotel View", "Rooms", "Dining", "Spa", "Weddings"];

const Galleries = ({ navigation }) => {
  const route = useRoute();
  const { hotelId } = route.params;

  const [isSelectNavItem, setSelectNavItem] = useState(0);
  const [itemWidths, setItemWidths] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const ScrollRef = useRef(null);
  const itemRefs = useRef([]);
  const { width, height } = Dimensions.get("window");

  const init = async () => {
    const res = await getHotelDetails(hotelId);
    if (res) {
      setData(res);
    }
  };

  const header = HeaderNormal({
    title: `${data?.name}`,
  });

  const handleSelectedNav = (index) => {
    setSelectNavItem(index);
    const visibleItems = 2; // Number of items to show in a row
    const totalItems = navTitleImage.length;

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

  const filteredGallery = data?.hotelImages?.filter(
    (item) => item?.title === navTitleImage[isSelectNavItem]
  );

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [isSelectNavItem]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 1500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions(header.setHeaderOptions());
  }, [navigation, header]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bkgPage }}>
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
          <ScrollView
            ref={ScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 35 }}
          >
            {navTitleImage.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectedNav(index)}
                onLayout={(event) => handleItemLayout(index, event)}
                ref={(ref) => (itemRefs.current[index] = ref)}
                style={{
                  borderBottomWidth: index === isSelectNavItem ? 1 : 0,
                  borderColor:
                    index === isSelectNavItem
                      ? themeColors.primary_Default
                      : "tranperent",
                }}
              >
                <Text
                  style={{
                    color:
                      index === isSelectNavItem
                        ? themeColors.primary_Default
                        : themeColors.black,
                    fontSize: 16,
                    fontWeight: index === isSelectNavItem ? 500 : "normal",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View
            style={{
              marginTop: 10,
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {filteredGallery?.map((item, index) => (
                <View key={index}>
                  {index % 3 === 0 && (
                    <Image
                      source={{ uri: `${URL_IMAGE}${item?.image}` }}
                      style={{
                        width: width - 50,
                        height: height / 3.5,
                        borderRadius: pixelNormalize(8),
                      }}
                    />
                  )}

                  {index % 3 === 1 && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: width - 50,
                        marginTop: 6,
                      }}
                    >
                      <Image
                        source={{
                          uri: `${URL_IMAGE}${item?.image}`,
                        }}
                        style={{
                          width: (width - 58) / 2,
                          height: height / 3.5,
                          borderRadius: pixelNormalize(8),
                        }}
                      />

                      {index + 1 < filteredGallery.length && (
                        <Image
                          source={{
                            uri: `${URL_IMAGE}${
                              filteredGallery[index + 1]?.image
                            }`,
                          }}
                          style={{
                            width: (width - 58) / 2,
                            height: height / 3.5,
                            borderRadius: pixelNormalize(8),
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>

            {filteredGallery?.length === 0 && (
              <View
                style={{
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
                  No images found!
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              marginTop: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={themeColors.primary} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Galleries;

const styles = StyleSheet.create({});
