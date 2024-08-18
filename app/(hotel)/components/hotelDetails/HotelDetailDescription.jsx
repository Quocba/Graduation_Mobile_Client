import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { calculateTotalRoom, formatDesc } from "../../../../utils/helper";
import { getHotelDetails } from "../../Hotel.Api";
import { getAllRoom } from "../../../(room)/Room.Api";

const HotelDetailDescription = ({ hotelId }) => {
  const [data, setData] = useState(null);
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(false);

  const init = async () => {
    const res = await getHotelDetails(hotelId);
    const room = await getAllRoom(hotelId);
    if (res) {
      setData(res);
    }

    if (room) {
      setRoom(room);
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
    <>
      {loading ? (
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
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: themeColors.title,
            }}
          >
            Hotel Description
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
                fontSize: 16,
                fontWeight: "bold",
                color: themeColors.black,
              }}
            >
              Opened:
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: themeColors.black,
                }}
              >
                {" "}
                {data?.openedIn}
              </Text>
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: themeColors.black,
              }}
            >
              Number of Rooms:
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: themeColors.black,
                }}
              >
                {" "}
                {calculateTotalRoom(room)}
              </Text>
            </Text>
          </View>

          <View
            style={{
              marginTop: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                lineHeight: 20,
              }}
            >
              {formatDesc(data?.description)}
            </Text>
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
    </>
  );
};

export default HotelDetailDescription;

const styles = StyleSheet.create({});
