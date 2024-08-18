import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ModalContent } from "react-native-modals";
import { themeColors } from "../../../../utils/theme/ThemeColor";
import { Entypo } from "@expo/vector-icons";

const ModalRating = ({ rating, setRating }) => {
  const handleStarChange = (starValue) => {
    setRating(starValue);
  };

  return (
    <ModalContent style={{ width: "100%", height: "auto" }}>
      <View
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {[1, 2, 3, 4, 5].map((starValue) => (
          <TouchableOpacity
            key={starValue}
            onPress={() => handleStarChange(starValue)}
          >
            <Entypo
              name={starValue <= rating ? "star" : "star-outlined"}
              size={28}
              color={themeColors.starRating}
            />
          </TouchableOpacity>
        ))}

        <Text
          style={{ fontSize: 18, fontWeight: "500", color: themeColors.black }}
        >
          {rating} star
        </Text>
      </View>
    </ModalContent>
  );
};

export default ModalRating;

const styles = StyleSheet.create({});
