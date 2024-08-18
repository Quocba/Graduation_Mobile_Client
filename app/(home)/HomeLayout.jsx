import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HeaderSearch } from "../../components/HeaderWithBottomNav";
import { pixelNormalize } from "../../components/Normalize";
import { images } from "../../constants";
import { URL_IMAGE } from "../../services/ApiUrl";
import { getAllHotel } from "./HomeLayout.Api";
import { themeColors } from "../../utils/theme/ThemeColor";
import { formatPriceWithType, renderStars } from "../../utils/helper";

const HomeLayout = () => {
  const navigation = useNavigation();
  const [hotelData, setHotelData] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (results) => {
    if (results) {
      const filteredResults = results.filter(
        (hotel) => hotel.hotelStandar === 5
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(null);
    }
  };

  const header = HeaderSearch({ logo: images.logo, onSearch: handleSearch });

  React.useLayoutEffect(() => {
    navigation.setOptions(header.headerOptions);
  }, [navigation]);

  const pollHotelData = async () => {
    setLoading(true);
    try {
      const data = await getAllHotel();
      setHotelData(data);
      setSearchResults(null);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setError("Error fetching hotel data");
      setLoading(false);
    }
  };

  useEffect(() => {
    pollHotelData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      pollHotelData();
    }, [])
  );

  const splitIntoRows = (data, numColumns) => {
    const filteredData = data.filter(
      (hotel) => hotel.hotelStandar === 5 && hotel.rooms.length > 0
    );

    const rows = [];
    for (let i = 0; i < filteredData.length; i += numColumns) {
      rows.push(filteredData.slice(i, i + numColumns));
    }
    return rows;
  };

  const hotelRows = splitIntoRows(
    searchResults === null ? hotelData : searchResults,
    2
  );

  const handleHotelPress = (hotel) => {
    navigation.navigate("HotelDetail", { hotelId: hotel.hotelID });
  };

  const renderHotelItem = ({ item }) => (
    <Pressable onPress={() => handleHotelPress(item)}>
      <View style={styles.hotelItem}>
        <Image
          source={{ uri: `${URL_IMAGE}${item.mainImage}` }}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <View style={styles.contentHotel}>
          <Text
            style={styles.hotelTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            {renderStars(item?.hotelStandar)}
          </View>
          <Text style={styles.ratingText}>
            <Text style={{ color: "#042F4D", fontWeight: "500" }}>
              {item?.avgRating?.toFixed(1)}
            </Text>
            /5 - {item.feedBack.length} reviews
          </Text>
          <Text style={styles.hotelCity}>{item.hotelAddress.city}</Text>
          <Text style={styles.priceText}>
            {formatPriceWithType(
              item.rooms.length > 0 ? item.rooms[0].price : 0
            )}
            {"\u00A0"}
            <Text style={styles.currencyText}>VND</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const renderHotelRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((hotel) => (
        <View key={hotel.hotelID} style={styles.hotelWrapper}>
          {renderHotelItem({ item: hotel })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, padding: 10, backgroundColor: themeColors.bkgPage }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>The most outstanding hotels</Text>
        {searchResults !== null && searchResults.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        )}
        <FlatList
          data={hotelRows}
          renderItem={renderHotelRow}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 0,
  },
  hotelWrapper: {
    width: "48%",
    marginBottom: 10,
  },
  hotelItem: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  hotelImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  contentHotel: {
    padding: 10,
  },
  hotelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  hotelCity: {
    borderWidth: 2,
    borderColor: "#028AE0",
    borderRadius: pixelNormalize(8),
    textAlign: "center",
    color: "#028AE0",
    maxWidth: "70%",
    fontWeight: "bold",
    paddingHorizontal: pixelNormalize(10),
    paddingVertical: pixelNormalize(5),
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingBottom: 10,
  },
  ratingText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#A3A3A3",
  },
  priceText: {
    textAlign: "right",
    paddingTop: 10,
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  currencyText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  noResultsContainer: {
    top: 250,
    flex: 1,
    alignItems: "center",
  },
  noResultsText: {
    fontWeight: "500",
    fontSize: 18,
    color: "#042f4d",
  },
});

export default HomeLayout;
