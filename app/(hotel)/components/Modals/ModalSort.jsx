import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ModalContent } from "react-native-modals";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { formatPriceWithType } from "../../../../utils/helper";

const ModalSort = ({
  selectedSort,
  setSelectedSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) => {
  const [formattedMinPrice, setFormattedMinPrice] = useState(
    formatPriceWithType(minPrice)
  );
  const [formattedMaxPrice, setFormattedMaxPrice] = useState(
    formatPriceWithType(maxPrice)
  );

  const handleMinPriceChange = (text) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setMinPrice(numericValue);
    setFormattedMinPrice(formatPriceWithType(numericValue));
  };

  const handleMaxPriceChange = (text) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setMaxPrice(numericValue);
    setFormattedMaxPrice(formatPriceWithType(numericValue));
  };

  const sorts = [
    {
      id: "0",
      sort: "Sort low to high",
    },
    {
      id: "1",
      sort: "Sort high to low",
    },
  ];

  return (
    <ModalContent style={{ width: "100%", height: "auto" }}>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 25,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            flex: 1.85,
          }}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                color: themeColors.black,
                marginBottom: 8,
              }}
            >
              Min Price
            </Text>
            <TextInput
              placeholder="VND 0"
              keyboardType="numeric"
              value={formattedMinPrice}
              onChangeText={handleMinPriceChange}
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: themeColors.gray,
                width: "100%",
                fontSize: 15,
              }}
            />
          </View>

          <View
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                color: themeColors.black,
                marginBottom: 8,
              }}
            >
              Max Price
            </Text>
            <TextInput
              placeholder="VND 9999"
              keyboardType="numeric"
              value={formattedMaxPrice}
              onChangeText={handleMaxPriceChange}
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: themeColors.gray,
                width: "100%",
                fontSize: 15,
              }}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            height: "100%",
            width: 1,
            backgroundColor: themeColors.gray,
          }}
        ></View>

        <View
          style={{
            flex: 2,
            flexDirection: "column",
            alignItems: "center",
            gap: 50,
          }}
        >
          {sorts.map((item, index) => (
            <TouchableOpacity
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
              key={index}
              onPress={() => setSelectedSort(item.sort)}
            >
              {selectedSort === item.sort ? (
                <MaterialIcons
                  name="circle"
                  size={18}
                  color={themeColors.primary_600}
                />
              ) : (
                <Feather
                  name="circle"
                  size={18}
                  color={themeColors.primary_600}
                />
              )}

              <Text style={{ fontSize: 18, fontWeight: "400" }}>
                {item.sort}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ModalContent>
  );
};

export default ModalSort;

const styles = StyleSheet.create({});
