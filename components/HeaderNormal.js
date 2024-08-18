import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { themeColors } from "../utils/theme/ThemeColor";
import { useNavigation } from "@react-navigation/native";

const HeaderNormal = ({ title }) => {
  const navigation = useNavigation();

  const setHeaderOptions = () => ({
    headerShown: true,
    title: title,
    headerTitleAlign: "center",
    headerTitleStyle: styles.headerTitleStyle,
    headerStyle: styles.headerStyle,
    headerLeft: () => (
      <TouchableOpacity
        style={styles.headerLeft}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={24}
          color={themeColors.white}
        />
      </TouchableOpacity>
    ),
  });

  return { setHeaderOptions };
};

export default HeaderNormal;

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: themeColors.white,
  },
  headerStyle: {
    backgroundColor: themeColors.primary_Default,
    height: 110,
    borderBottomColor: "transparent",
    shadowColor: "transparent",
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    opacity: 0.8,
  },
});
