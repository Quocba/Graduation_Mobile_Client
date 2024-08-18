import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import MapView, { Callout, Marker } from "react-native-maps";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { formatPrice } from "../../../../utils/helper";
import { FontAwesome6 } from "@expo/vector-icons";
import { getAllRoom } from "../../../(room)/Room.Api";
import { getHotelDetails } from "../../Hotel.Api";
import { pixelNormalize } from "../../../../components/Normalize";

const MapScreen = () => {
  const route = useRoute();
  const mapView = useRef(null);
  const { hotelId, latitude, longitude } = route.params;
  const [data, setData] = useState(null);
  const [roomPrice, setRoomPrice] = useState([]);
  const [loading, setLoading] = useState(false);

  const init = async () => {
    const res = await getHotelDetails(hotelId);
    if (res) {
      setData(res);
    }

    const roomRes = await getAllRoom(hotelId);
    if (roomRes) {
      setRoomPrice(roomRes);
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

  const coordinates = [];
  const details = coordinates.push({
    latitude: Number(latitude),
    longitude: Number(longitude),
  });

  const initialRegion = {
    latitude: Number(latitude),
    longitude: Number(longitude),
    latitudeDelta: 0.0721,
    longitudeDelta: 0.0221,
  };

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

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <MapView
          aria-valuenow={details}
          ref={mapView}
          style={{ width: "100%", height: "100%" }}
          initialRegion={initialRegion}
        >
          <Marker
            key={hotelId}
            coordinate={{
              latitude: Number(latitude),
              longitude: Number(longitude),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome6
                name="hotel"
                size={24}
                color={themeColors.primary}
              />
            </View>
            <Callout>
              <View
                style={{
                  padding: 10,
                  alignItems: "center",
                  maxWidth: pixelNormalize(250),
                  minWidth: pixelNormalize(250),
                  gap: 6,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: themeColors.title,
                  }}
                >
                  {data?.name}
                </Text>
                <Pressable
                  style={{
                    backgroundColor: themeColors.primary_Default,
                    paddingHorizontal: 7,
                    paddingVertical: 4,
                    borderRadius: 4,
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: themeColors.white,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {formatPrice(getCurrentPrice(roomPrice[0]))} VND
                  </Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        </MapView>
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
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
