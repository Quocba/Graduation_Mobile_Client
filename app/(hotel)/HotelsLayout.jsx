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
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { HeaderSearch } from "../../components/HeaderWithBottomNav";
import { images } from "../../constants";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import { themeColors } from "../../utils/theme/ThemeColor";
import { pixelNormalize } from "../../components/Normalize";
import {
  BottomModal,
  ModalButton,
  ModalFooter,
  ModalTitle,
  SlideAnimation,
} from "react-native-modals";

import { useFocusEffect } from "@react-navigation/native";
import ModalRating from "./components/Modals/ModalRating";
import ModalSort from "./components/Modals/ModalSort";
import ModalFilter from "./components/Modals/ModalFilter";
import { getAllHotel } from "./Hotel.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import { formatPrice, renderStars } from "../../utils/helper";
import { filterListHotelsHaveRoom } from "../../utils/filter";

const HotelsLayout = ({ navigation }) => {
  const handleSearch = (results) => {
    setSearchResults(results);

    if (ScrollRef.current) {
      ScrollRef.current.scrollTo({
        offset: 0,
        animated: true,
      });
    }
  };

  const header = HeaderSearch({ logo: images.logo, onSearch: handleSearch });

  const { width, height } = Dimensions.get("window");
  const [searchResults, setSearchResults] = useState(null);
  const [modalRating, setModalRating] = useState(false);
  const [modalSort, setModalSort] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);

  const [rating, setRating] = useState(0);
  const [selectedSort, setSelectedSort] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(9999999);
  const [selectedServices, setSelectedServices] = useState({});
  const ScrollRef = useRef(null);

  const [data, setData] = useState([]);

  const listHotels = filterListHotelsHaveRoom(
    searchResults === null ? data : searchResults
  );

  const [filtedHotels, setFiltedHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const applyFilter = (listHotels) => {
    let filtered = [];

    if (modalRating) {
      setRating(0);
      if (rating > 0) {
        filtered = listHotels.filter((hotel) => hotel?.hotelStandar === rating);
      }
      setModalRating(false);
    }

    // Filter by Price for min & max
    if (modalSort) {
      setMinPrice(0); // Reset giá khi modal đóng
      setMaxPrice(9999999);
      setSelectedSort("");
      if (minPrice >= 0 && maxPrice <= 9999999) {
        filtered = listHotels.filter(
          (hotel) =>
            hotel?.rooms[0]?.price >= minPrice &&
            hotel?.rooms[0]?.price <= maxPrice
        );
      }

      // Filter by sort
      if (selectedSort === "Sort low to high") {
        filtered = listHotels.sort(
          (a, b) => a?.rooms[0]?.price - b?.rooms[0]?.price
        );
      } else if (selectedSort === "Sort high to low") {
        filtered = listHotels.sort(
          (a, b) => b?.rooms[0]?.price - a?.rooms[0]?.price
        );
      }
      setModalSort(false);
    }

    // Filter by Services
    if (
      modalFilter &&
      selectedServices &&
      Object.keys(selectedServices)?.length > 0
    ) {
      setSelectedServices({}); // Reset dịch vụ khi modal đóng
      filtered = listHotels.filter((hotel) =>
        hotel?.hotelService.some(
          (service) => selectedServices[service?.serviceType]
        )
      );
      setModalFilter(false);
    }

    if (ScrollRef.current) {
      ScrollRef.current.scrollTo({
        offset: 0,
        animated: true,
      });
    }
    setFiltedHotels(filtered);
  };

  const init = async () => {
    const res = await getAllHotel();
    if (res) {
      setData(res);
      setSearchResults(null);
      setFiltedHotels(filterListHotelsHaveRoom(res));
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setFiltedHotels(
      filterListHotelsHaveRoom(searchResults === null ? data : searchResults)
    );
  }, [searchResults, data]);

  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 2500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions(header.headerOptions);
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bkgPage }}>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: themeColors.white,
          elevation: 4,
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
          onPress={() => setModalRating(!modalRating)}
        >
          <MaterialIcons name="stars" size={24} color="black" />
          <Text style={{ fontSize: 15, fontWeight: "500", color: "gray" }}>
            Standard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
          onPress={() => setModalSort(!modalSort)}
        >
          <FontAwesome name="filter" size={24} color="black" />
          <Text style={{ fontSize: 15, fontWeight: "500", color: "gray" }}>
            Sort Price
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
          onPress={() => setModalFilter(!modalFilter)}
        >
          <FontAwesome5 name="clipboard-list" size={24} color="black" />
          <Text style={{ fontSize: 15, fontWeight: "500", color: "gray" }}>
            Service
          </Text>
        </TouchableOpacity>
      </Pressable>

      {loading ? (
        <ScrollView ref={ScrollRef} style={{ flex: 1, padding: 10 }}>
          {filtedHotels?.map((item) => (
            <Pressable
              onPress={() =>
                navigation.navigate("HotelDetail", {
                  hotelId: item?.hotelID,
                })
              }
              key={item?.hotelID}
              style={{
                width: "100%",
                backgroundColor: themeColors.white,
                borderRadius: 8,
                marginBottom: 20,
                elevation: 4,
                shadowOffset: { width: -2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <View>
                  <Image
                    style={{
                      width: width - 250,
                      height: height / 3.2,
                      borderTopLeftRadius: pixelNormalize(8),
                      borderBottomLeftRadius: pixelNormalize(8),
                      flexShrink: 1,
                    }}
                    source={{
                      uri: `${URL_IMAGE}${item?.mainImage}`,
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    paddingVertical: 10,
                    width: "56.3%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: themeColors.title,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item?.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <Entypo name="home" size={18} color={themeColors.primary} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        marginLeft: 4,
                      }}
                    >
                      Eposh Booking
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 6,
                      flexDirection: "row",
                      gap: 4,
                    }}
                  >
                    {renderStars(item?.hotelStandar)}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 4,
                      alignItems: "center",
                      marginTop: 6,
                    }}
                  >
                    <Fontisto
                      name="map-marker-alt"
                      size={18}
                      color={themeColors.primary_600}
                    />
                    <Text style={{ fontSize: 14, fontWeight: "400" }}>
                      {item?.hotelAddress?.city}
                    </Text>
                  </View>

                  <View
                    style={{
                      borderRadius: 4,
                      marginRight: 10,
                      marginTop: 5,
                      padding: 10,
                    }}
                  >
                    {item?.rooms[0]?.quantity <= 5 && (
                      <Text
                        style={{
                          fontSize: 14,
                          color: themeColors.button_Secondary,
                          width: "100%",
                        }}
                      >
                        {item?.rooms[0]?.quantity === 1
                          ? `Only have ${item?.rooms[0]?.quantity} room`
                          : `Only has ${item?.rooms[0]?.quantity} rooms`}
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 7,
                        marginTop: 7,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: themeColors.title,
                          flexShrink: 1,
                        }}
                      >
                        {formatPrice(item?.rooms[0]?.price)} VND
                      </Text>

                      <TouchableOpacity
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          backgroundColor: themeColors.primary_Default,
                          borderRadius: 4,
                        }}
                        onPress={() =>
                          navigation.navigate("HotelDetail", {
                            hotelId: item?.hotelID,
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: themeColors.white,
                          }}
                        >
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}

          {filtedHotels !== null && filtedHotels?.length === 0 && (
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
                No hotels found!
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )}

      <BottomModal
        onBackdropPress={() => setModalRating(!modalRating)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
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
              onPress={() => applyFilter(listHotels)}
            />
          </ModalFooter>
        }
        modalTitle={
          <ModalTitle
            textStyle={{ color: themeColors.title, fontWeight: "500" }}
            title="Filter Hotels Standard"
          />
        }
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalRating(!modalRating)}
        visible={modalRating}
        onTouchOutside={() => setModalRating(!modalRating)}
      >
        {modalRating && <ModalRating rating={rating} setRating={setRating} />}
      </BottomModal>

      <BottomModal
        onBackdropPress={() => setModalSort(!modalSort)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
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
              onPress={() => applyFilter(listHotels)}
            />
          </ModalFooter>
        }
        modalTitle={
          <ModalTitle
            textStyle={{ color: themeColors.title, fontWeight: "500" }}
            title="Filter And Sort Price"
          />
        }
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalSort(!modalSort)}
        visible={modalSort}
        onTouchOutside={() => setModalSort(!modalSort)}
      >
        {modalSort && (
          <ModalSort
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        )}
      </BottomModal>

      <BottomModal
        onBackdropPress={() => setModalFilter(!modalFilter)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
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
              onPress={() => applyFilter(listHotels)}
            />
          </ModalFooter>
        }
        modalTitle={
          <ModalTitle
            textStyle={{ color: themeColors.title, fontWeight: "500" }}
            title="Filter Services"
          />
        }
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalFilter(!modalFilter)}
        visible={modalFilter}
        onTouchOutside={() => setModalFilter(!modalFilter)}
      >
        {modalFilter && (
          <ModalFilter
            listHotels={listHotels}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />
        )}
      </BottomModal>
    </SafeAreaView>
  );
};

export default HotelsLayout;

const styles = StyleSheet.create({});
