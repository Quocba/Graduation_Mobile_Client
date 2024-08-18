import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { themeColors } from "./utils/theme/ThemeColor";
import HomeLayout from "./app/(home)/HomeLayout";
import MomentsLayout from "./app/(moment)/MomentsLayout";
import CreateBlog from "./app/(moment)/CreateBlog";
import MomentDetailPage from "./app/(moment)/MomentDetailPage";
import VouchersLayout from "./app/(voucher)/VouchersLayout";
import AccountLayout from "./app/(account)/AccountLayout";
import SignInScreen from "./app/(auth)/SignInScreen";
import SignUpScreen from "./app/(auth)/SignUpScreen";
import ForgotPasswordScreen from "./app/(auth)/ForgotPasswordScreen";
import VerifyOTP from "./app/(auth)/VerifyOTP";
import VerifyEmailScreen from "./app/(auth)/VerifyEmailScreen";
import ResetPasswordScreen from "./app/(auth)/ResetPasswordScreen";
import MyBookingsPage from "./app/(account)/MyBooking";
import MyVoucherPage from "./app/(account)/MyVoucherPage";
import TermsOfService from "./app/(account)/TermsOfService";
import ModelViewMyVouchers from "./app/(account)/Modal/ModelViewMyVouchers";
import MyPostsPage from "./app/(account)/MyPostsPage";
import AccountProfile from "./app/(account)/AccountProfileLayout";
import EditProfile from "./app/(account)/Modal/EditProfilePage";
import BookingDetailAwaitingCheckin from "./app/(account)/BookingDetailAwaitingCheckin";
import BookingDetailAwaitingPayment from "./app/(account)/BookingDetailAwaitingPayment";
import BookingDetailCompleted from "./app/(account)/BookingDetailCompleted";
import BookingDetailCanceled from "./app/(account)/BookingDetailCanceled";
import SplashScreen from "./app/SplashScreen";
import HotelDetails from "./app/(hotel)/HotelDetailLayout";
import Guest_Reviews from "./app/(hotel)/components/navigateFromDetails/Guest_Reviews";
import Galleries from "./app/(hotel)/components/navigateFromDetails/Galleries";
import CreateBookingLayout from "./app/(room)/CreateBookingLayout";
import MapScreen from "./app/(hotel)/components/navigateFromDetails/MapScreen";
import HotelsLayout from "./app/(hotel)/HotelsLayout";
import RoomDetailsLayout from "./app/(room)/RoomDetailsLayout";
import AuthPhone from "./app/(auth)/AuthPhone";
import UpdateEmailScreen from "./app/(account)/UpdateEmailScreen";
import VerifyUpdateEmailScreen from "./app/(account)/VerifyUpdateEmailScreen";
import UpdatePhoneScreen from "./app/(account)/UpdatePhoneScreen";
import VerifyUpdatePhoneScreen from "./app/(account)/VerifyUpdatePhoneScreen";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {icon}
      <Text
        style={{
          color: color,
          fontWeight: focused ? "700" : "normal",
          fontSize: 14,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const StackNavigator = ({ initialRouteName }) => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: themeColors.primary_Default,
          tabBarInactiveTintColor: themeColors.gray,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: themeColors.white,
            borderTopWidth: 1,
            height: 84,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeLayout}
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={
                  focused ? (
                    <Entypo
                      name="home"
                      size={24}
                      color={themeColors.primary_Default}
                    />
                  ) : (
                    <AntDesign name="home" size={24} color={themeColors.gray} />
                  )
                }
                name="Home"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Hotels"
          component={HotelsLayout}
          options={{
            tabBarLabel: "Hotels",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={
                  focused ? (
                    <MaterialCommunityIcons
                      name="home-city"
                      size={24}
                      color={themeColors.primary_Default}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="home-city-outline"
                      size={24}
                      color={themeColors.gray}
                    />
                  )
                }
                name="Hotels"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Moments"
          component={MomentsLayout}
          options={{
            tabBarLabel: "Moments",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={
                  focused ? (
                    <Ionicons
                      name="images"
                      size={24}
                      color={themeColors.primary_Default}
                    />
                  ) : (
                    <Ionicons
                      name="images-outline"
                      size={24}
                      color={themeColors.gray}
                    />
                  )
                }
                name="Moments"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Vouchers"
          component={VouchersLayout}
          options={{
            tabBarLabel: "Voucher",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={
                  focused ? (
                    <Ionicons
                      name="ticket"
                      size={24}
                      color={themeColors.primary_Default}
                    />
                  ) : (
                    <Ionicons
                      name="ticket-outline"
                      size={24}
                      color={themeColors.gray}
                    />
                  )
                }
                name="Vouchers"
              />
            ),
          }}
        />

        <Tab.Screen
          name="Account"
          component={AccountLayout}
          options={{
            tabBarLabel: "Account",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                color={color}
                focused={focused}
                icon={
                  focused ? (
                    <Ionicons
                      name="person"
                      size={24}
                      color={themeColors.primary_Default}
                    />
                  ) : (
                    <Ionicons
                      name="person-outline"
                      size={24}
                      color={themeColors.gray}
                    />
                  )
                }
                name="Account"
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HomeLayout"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HotelsLayout"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MomentsLayout"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VouchersLayout"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AccountLayout"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HotelDetail"
        component={HotelDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Guest_Reviews"
        component={Guest_Reviews}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Galleries"
        component={Galleries}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Room"
        component={RoomDetailsLayout}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Booking"
        component={CreateBookingLayout}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyVoucherPage"
        component={MyVoucherPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ModelViewMyVouchers"
        component={ModelViewMyVouchers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyPostsPage"
        component={MyPostsPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AccountProfile"
        component={AccountProfile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CreateBlog"
        component={CreateBlog}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MomentDetailPage"
        component={MomentDetailPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyBookingsPage"
        component={MyBookingsPage}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BookingDetailAwaitingCheckin"
        component={BookingDetailAwaitingCheckin}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BookingDetailAwaitingPayment"
        component={BookingDetailAwaitingPayment}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BookingDetailCompleted"
        component={BookingDetailCompleted}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BookingDetailCanceled"
        component={BookingDetailCanceled}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyOTP"
        component={VerifyOTP}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmailScreen"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthPhone"
        component={AuthPhone}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfService}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateEmailScreen"
        component={UpdateEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyUpdateEmailScreen"
        component={VerifyUpdateEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdatePhoneScreen"
        component={UpdatePhoneScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="VerifyUpdatePhoneScreen"
        component={VerifyUpdatePhoneScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
