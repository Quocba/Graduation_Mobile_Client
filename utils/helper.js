import React from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeColors } from "./theme/ThemeColor";
import { Entypo } from "@expo/vector-icons";

// Format price
export const formatPrice = (number) => number?.toLocaleString("vi-VN");
export const formatPriceWithType = (number) => {
  if (typeof number !== "number") {
    return "";
  }
  return number.toLocaleString("vi-VN");
};

//Format Desc UI
export const formatDesc = (text, style) => {
  const paragraphs = text?.trim().split("\n");
  return paragraphs?.map((paragraph, index) => (
    <Text key={index}>
      {paragraph}
      {index !== paragraphs?.length - 1 && <Text>{"\n\n"}</Text>}
    </Text>
  ));
};

// Format phone number -> 09xx - xxx - xxx
export const formatPhoneNumber = (phoneNumber) => {
  const formattedNumber = phoneNumber?.replace(
    /(\d{4})(\d{3})(\d{3})/,
    "$1 - $2 - $3"
  );

  return formattedNumber;
};

// Format Date -> January 20
export const formatDateMonthAndDay = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Format Date -> Fri, May 24, 2024
export const formatDateWithWeekDay = (dateString) => {
  const date = new Date(dateString);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

// Calculate nights
export const calculateNights = (startDateString, endDateString) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const differenceInMilliseconds = endDate - startDate;

  const differenceInDays = differenceInMilliseconds / millisecondsPerDay;

  return differenceInDays;
};

// Calculate total quantity of room of hotel
export const calculateTotalRoom = (listRoom) => {
  let count = 0;
  listRoom?.map((element) => {
    return (count += element?.quantity);
  });
  return count;
};

//Uppercase data
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const renderDescription = (description) => {
  return description.split("\r\n").map((paragraph, index) => (
    <Text key={index} style={{ fontSize: 16, marginBottom: 10 }}>
      {paragraph}
    </Text>
  ));
};

export const checkLogin = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token !== null;
  } catch (e) {
    console.error("Failed to check login status", e);
    return false;
  }
};

export const renderStars = (rating) => {
  let stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(
      <Entypo key={i} name="star" size={18} color={themeColors.starRating} />
    );
  }
  return stars;
};
