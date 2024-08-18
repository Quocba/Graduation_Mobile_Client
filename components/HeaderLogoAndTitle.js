import { Image, Text, View } from "react-native";
import { themeColors } from "../utils/theme/ThemeColor";

export const HeaderLogoTitle = (logo) => {
  const headerOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: themeColors.primary_Default },
    headerShadowVisible: false,
    headerTitleAlign: "left",
    headerTitle: () => (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          paddingHorizontal: 10,
          paddingVertical: 8,
        }}
      >
        <Image
          source={logo}
          style={{
            width: 50,
            height: 50,
            resizeMode: "contain",
            marginRight: 60,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: themeColors.white,
            textAlign: "center",
          }}
        >
          Eposh Booking
        </Text>
      </View>
    ),
  };

  return { headerOptions };
};
