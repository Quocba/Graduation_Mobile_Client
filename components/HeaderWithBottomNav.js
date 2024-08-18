import React, { useState, useCallback, useRef } from "react";
import { Image, TextInput, View, ActivityIndicator, Alert } from "react-native";
import debounce from "lodash/debounce";
import { themeColors } from "../utils/theme/ThemeColor";
import { getSearchName } from "../app/(auth)/Auth.Api";
import { useFocusEffect } from "@react-navigation/native";

export const HeaderSearch = ({ logo, onSearch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const debouncedSearch = useCallback(
    debounce(async (text) => {
      try {
        setIsLoading(true);
        if (text.length >= 1) {
          const res = await getSearchName(text);
          if (res) {
            const filteredResults = res.filter((hotel) =>
              hotel.name.toLowerCase().includes(text.toLowerCase())
            );
            onSearch(filteredResults);
          } else {
            onSearch([]);
          }
        } else {
          onSearch(null);
        }
      } catch (err) {
        setError(err);
        Alert.alert("Error", "There was an error fetching data.");
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (inputRef.current) {
          inputRef.current.clear();
          onSearch(null);
        }
      };
    }, [])
  );

  const handleSearch = (text) => {
    debouncedSearch(text);
  };

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
            marginRight: 20,
          }}
        />
        <TextInput
          ref={inputRef}
          placeholder="Search here..."
          placeholderTextColor={themeColors.gray}
          onChangeText={handleSearch}
          style={{
            width: "80%",
            paddingVertical: 8,
            paddingHorizontal: 14,
            backgroundColor: themeColors.white,
            borderRadius: 4,
          }}
        />
        {isLoading && (
          <ActivityIndicator size="small" color={themeColors.primary_Default} />
        )}
      </View>
    ),
  };

  return { headerOptions, isLoading, error };
};
