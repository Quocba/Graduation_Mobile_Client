import React, { useState, useLayoutEffect, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import HeaderNormal from "../../../components/HeaderNormal";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { updateProfile } from "../../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themeColors } from "../../../utils/theme/ThemeColor";

const EditProfilePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const profileData = route.params?.profileData || {};
  const oldAvatar = `${profileData?.profile?.avatar}`;
  const [loading, setLoading] = useState(false);
  const headerOptions = HeaderNormal({
    title: "Edit Profile",
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [profile, setProfile] = useState({
    fullName: profileData?.profile?.fullName || "",
    birthday: profileData?.profile?.birthDay
      ? profileData.profile.birthDay.split("T")[0]
      : "",
    gender: profileData?.profile?.gender || "",
    address: profileData?.profile?.address || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    avatarUrl: profileData?.profile?.avatar,
    avatar: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSave = async () => {
    try {
      if (!profile.fullName) {
        Alert.alert("Error", "Fullname is required.");
        return;
      }

      if (profile.fullName.length > 32) {
        Alert.alert("Error", "Fullname must be less than 32 characters.");
        return;
      }

      if (profile.address.length < 1 || profile.address.length > 255) {
        Alert.alert("Error", "Address must be between 1 and 255 characters.");
        return;
      }

      const accountId = await AsyncStorage.getItem("accountId");
      const formData = new FormData();
      formData.append("accountId", accountId);
      formData.append("fullName", profile.fullName);
      formData.append("birthDay", profile.birthday);
      formData.append("gender", profile.gender);
      formData.append("address", profile.address);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);

      if (profile.avatar !== null) {
        formData.append("Avatar", {
          uri: profile.avatar.uri,
          type: profile.avatar.mimeType,
          name: profile.avatar.fileName,
        });
      } else {
        formData.append("Avatar", oldAvatar);
      }

      const response = await updateProfile(formData);

      if (response) {
        Alert.alert("Success", "Profile updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Profile update failed!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }

  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(true);
    }, 2000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);


  const handleFieldChange = (key, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = new Date(selectedDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      handleFieldChange("birthday", formattedDate);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      if (result.assets && result.assets.length > 0) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: result.assets[0],
          avatarUrl: result.assets[0].uri,
        }));
      }
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const getInputStyle = (field) => {
    return [
      styles.input,
      (focusedField === field || profile[field]) && styles.focusedInput,
    ];
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.ContainerEdit}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              <Image
                source={
                  profile?.avatarUrl?.startsWith('/', 0)
                    ? { uri: `${URL_IMAGE}${profile?.avatarUrl}` }
                    : profile?.avatarUrl?.includes("https") || profile?.avatarUrl?.includes("file")
                      ? { uri: `${profile?.avatarUrl}` }
                      : require("../../../assets/logo.png")
                }
                style={styles.avatar}
              />
              <Text style={styles.changeAvatarText}>Change Avatar image</Text>
            </TouchableOpacity>

            <Text style={styles.EditLabel}>Fullname</Text>
            <TextInput
              style={getInputStyle("fullName")}
              placeholder="Full Name"
              value={profile.fullName}
              onFocus={() => handleFocus("fullName")}
              onBlur={handleBlur}
              onChangeText={(text) => handleFieldChange("fullName", text)}
            />
            <Text style={styles.EditLabel}>Birthday</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={openDatePicker}
            >
              <Text style={styles.datePickerText}>{profile.birthday}</Text>
              <Ionicons
                name="calendar"
                size={24}
                color="black"
                style={styles.datePickerIcon}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={profile.birthday ? new Date(profile.birthday) : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === "Male" && styles.selectedGender,
                ]}
                onPress={() => handleFieldChange("gender", "Male")}
              >
                <Text>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === "Female" && styles.selectedGender,
                ]}
                onPress={() => handleFieldChange("gender", "Female")}
              >
                <Text>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === "Other" && styles.selectedGender,
                ]}
                onPress={() => handleFieldChange("gender", "Other")}
              >
                <Text>Other</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.EditLabel}>Address</Text>
            <TextInput
              style={getInputStyle("address")}
              placeholder="Address"
              value={profile.address}
              onFocus={() => handleFocus("address")}
              onBlur={handleBlur}
              onChangeText={(text) => handleFieldChange("address", text)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#F0F2F5",
  },
  ContainerEdit: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#CCCCCC",
  },
  changeAvatarText: {
    marginTop: 5,
    fontSize: 16,
    color: "#007AFF",
  },
  EditLabel: {
    color: "#000000",
    fontSize: 16,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    color: "#000000",
  },
  focusedInput: {
    backgroundColor: "#DEF1FF",
    color: "#2CBFFF",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  datePickerIcon: {
    marginLeft: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  genderLabel: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  genderOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  selectedGender: {
    backgroundColor: "#DEF1FF",
  },
  saveButton: {
    backgroundColor: "#2CBFFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  fieldTitleContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  EditLabel: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
  },
  loadingText: {
    fontSize: 18,
    color: "#000000",
  },
});

export default EditProfilePage;