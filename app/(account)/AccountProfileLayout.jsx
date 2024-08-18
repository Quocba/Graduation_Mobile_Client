import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile, changePassword, resetPassword } from "../(auth)/Auth.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import SaveChangePassword from "./Modal/SaveChangePassword";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatDate, formatPhoneNumber } from "../../utils/helper";
import HeaderNormal from "../../components/HeaderNormal";

const AccountProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const headerOptions = HeaderNormal({
    title: "Account Profile",
  }).setHeaderOptions;

  React.useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const fetchUserProfile = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      const res = await getProfile(accountId);
      if (res) {
        setData(res);
      } else {
        console.error("Error fetching profile: Data not found!");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Redirecting to login...");
      } else {
        console.error("Error fetching profile:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setError(null);
      fetchUserProfile();
    }, [])
  );

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handlePasswordChange = (key, value) => {
    setPasswords({
      ...passwords,
      [key]: value,
    });
  };

  const handleNavigateToUpdateEmail = () => {
    navigation.navigate("UpdateEmailScreen", { currentEmail: data.email });
  };
  const handleNavigateToUpdatePhone = () => {
    navigation.navigate("UpdatePhoneScreen", { currentPhone: data.phone, currentEmail: data.email });
  };


  const validatePasswords = () => {
    let valid = true;
    let errors = {};

    if (data.password && !passwords.oldPassword) {
      valid = false;
      errors.oldPassword = "Old password is required!";
    } else if (passwords.oldPassword) {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

      if (!passwordPattern.test(passwords.oldPassword)) {
        valid = false;
        errors.oldPassword =
          "New password must be 8-16 characters long and include uppercase, lowercase, number, and special character!";
      }
    }
    if (!passwords.newPassword) {
      valid = false;
      errors.newPassword = "New password is required!";
    } else {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

      if (!passwordPattern.test(passwords.newPassword)) {
        valid = false;
        errors.newPassword =
          "New password must be 8-16 characters long and include uppercase, lowercase, number, and special character!";
      }
    }

    if (!passwords.confirmPassword) {
      valid = false;
      errors.confirmPassword = "Confirm password is required!";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      valid = false;
      errors.confirmPassword = "Confirm password is not equal to password!";
    } else {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

      if (!passwordPattern.test(passwords.confirmPassword)) {
        valid = false;
        errors.confirmPassword =
          "New password must be 8-16 characters long and include uppercase, lowercase, number, and special character!";
      }
    }

    setErrors(errors);
    return valid;
  };

  const handleSave = async () => {
    if (validatePasswords()) {
      try {
        const dataChangePass = {
          accountId: await AsyncStorage.getItem("accountId"),
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        };
        const res = await changePassword(dataChangePass);

        if (res.status === 200) {
          setPasswords({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setShowSuccessAlert(true);
          fetchUserProfile();
        } else {
          const errorMessage =
            res.data && res.data.message
              ? res.data.message
              : "Old password is incorrect to change!";
          Alert.alert("Error", errorMessage);
        }
      } catch (error) {
        console.error("Error changing password:", error);
        Alert.alert(
          "Error",
          "Server maintenance is underway. Please try again later!"
        );
      }
    }
  };


  const handleUpdate = async () => {
    const { newPassword, confirmPassword } = passwords;
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "New password and confirm password are required!");
      return;
    }

    if (!regexPassword.test(newPassword) || !regexPassword.test(confirmPassword)) {
      Alert.alert(
        "Error",
        "Password must be 8-16 characters long and include uppercase, lowercase, number, and special character!"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password must match!");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("email", data?.email);
      formData.append("newPassword", confirmPassword);

      const response = await resetPassword(formData);

      if (response.status === 200) {
        Alert.alert(
          "Success",
          "Password Save successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                setPasswords({
                  newPassword: "",
                  confirmPassword: "",
                });
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to update password!");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "An error occurred while updating the password!");
    }
  };


  const handleCancel = () => {
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile", { profileData: data });
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
      (focusedField === field || data[field] || passwords[field]) &&
      styles.focusedInput,
    ];
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View
          style={[
            styles.loadingContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.Profile}>
            <Text style={styles.TitleProfile}>Basic Information</Text>
            <View style={styles.basicInfo}>
              <Image
                source={
                  data?.profile?.avatar?.startsWith("/", 0)
                    ? { uri: `${URL_IMAGE}${data.profile.avatar}` }
                    : data?.profile?.avatar?.includes("https")
                      ? { uri: `${data.profile.avatar}` }
                      : require("../../assets/logo.png")
                }
                style={styles.avatar}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={navigateToEditProfile}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.text}>{data?.profile?.fullName}</Text>

              <View style={styles.fieldTitleContainer}>
                <Text style={styles.EditLabel}>Email</Text>
                <Text style={styles.changeEmailLabel} onPress={handleNavigateToUpdateEmail}>
                  <Icon name="pencil" size={16} color="#007AFF" />  Edit Email
                </Text>
              </View>
              <Text style={styles.text}>{data?.email}</Text>

              <View style={styles.fieldTitleContainer}>
                <Text style={styles.EditLabel}>Phone</Text>
                {data.email && (
                  <Text style={styles.changeEmailLabel} onPress={handleNavigateToUpdatePhone}>
                    <Icon name="pencil" size={16} color="#007AFF" />  Edit Phone
                  </Text>
                )}
              </View>
              <Text style={styles.text}>
                {data?.phone ? formatPhoneNumber(data?.phone) : "-"}
              </Text>

              <Text style={styles.label}>Birthday</Text>
              <Text style={styles.text}>
                {data?.profile?.birthDay
                  ? formatDate(data?.profile?.birthDay)
                  : "-"}
              </Text>

              <Text style={styles.label}>Gender</Text>
              <Text style={styles.text}>
                {data?.profile?.gender ? data?.profile?.gender : "-"}
              </Text>

              <Text style={styles.label}>Address</Text>
              <Text style={styles.text}>
                {data?.profile?.address ? data?.profile?.address : "-"}
              </Text>
            </View>
          </View>

          <View style={styles.changePassword}>
            <View style={styles.changePasswordContainer}>
              <Text style={styles.sectionTitle}>
                {data.password ? "Change Password" : "Save Password"}
              </Text>
              {data.password && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Old Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={getInputStyle("oldPassword")}
                      placeholder="Enter old password"
                      secureTextEntry={!showPasswords.oldPassword}
                      value={passwords.oldPassword}
                      onChangeText={(value) => handlePasswordChange("oldPassword", value)}
                      onFocus={() => handleFocus("oldPassword")}
                      onBlur={handleBlur}
                    />
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => toggleShowPassword("oldPassword")}
                    >
                      <Icon
                        name={showPasswords.oldPassword ? "eye" : "eye-slash"}
                        size={20}
                        color="#000"
                        style={styles.eyeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.oldPassword && (
                    <Text style={styles.errorText}>{errors.oldPassword}</Text>
                  )}
                </View>
              )}


              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={getInputStyle("newPassword")}
                  placeholder="Please enter your new password"
                  secureTextEntry={!showPasswords.newPassword}
                  value={passwords.newPassword}
                  onFocus={() => handleFocus("newPassword")}
                  onBlur={handleBlur}
                  onChangeText={(text) =>
                    handlePasswordChange("newPassword", text)
                  }
                />
                <TouchableOpacity
                  onPress={() => toggleShowPassword("newPassword")}
                >
                  <Icon
                    name={showPasswords.newPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#000"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={getInputStyle("confirmPassword")}
                  placeholder="Please confirm your new password"
                  secureTextEntry={!showPasswords.confirmPassword}
                  value={passwords.confirmPassword}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={handleBlur}
                  onChangeText={(text) =>
                    handlePasswordChange("confirmPassword", text)
                  }
                />
                <TouchableOpacity
                  onPress={() => toggleShowPassword("confirmPassword")}
                >
                  <Icon
                    name={showPasswords.confirmPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#000"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              {data.password ? (
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Update</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                  <Text style={styles.updateButtonText}>Save</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.general && (
            <Text style={styles.errorText}>{errors.general}</Text>
          )}
          <SaveChangePassword
            visible={showSuccessAlert}
            message="Password changed successfully."
            onClose={() => setShowSuccessAlert(false)}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#F0F2F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
  },
  Profile: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  TitleProfile: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  basicInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    backgroundColor: "#00A5F5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  infoContainer: {
    paddingTop: 10,
  },
  label: {
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
    flex: 1,
  },
  longPasswordInput: {
    flex: 4,
  },
  focusedInput: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  changePassword: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  changePasswordContainer: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#00A5F5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: "#00A5F5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -30,
    marginTop: -15,
  },
  text: {
    backgroundColor: "#EEF5FF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEF5FF",
    color: "#36b8fa",
  },
  successAlert: {
    backgroundColor: "#00E676",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  successText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF0000",
    marginBottom: 10,
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
  changeEmailLabel: {
    color: "#007AFF",
    fontSize: 14,
  },
});

export default AccountProfile;
