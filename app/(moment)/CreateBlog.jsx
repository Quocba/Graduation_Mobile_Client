import React, { useState, useLayoutEffect } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { images } from "../../constants";
import { createPost } from "./MomentsLayout.Api";
import { pixelNormalize } from "../../components/Normalize";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateBlog = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "Create Blog",
  }).setHeaderOptions;

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isCheckedForThisPost, setIsCheckedForThisPost] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleCheckboxChange = () => {
    setIsCheckedForThisPost(!isCheckedForThisPost);
  };

  const handleImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri =
          result.assets && result.assets.length > 0
            ? result.assets[0].uri
            : result.uri;
        if (selectedImages.length < 5) {
          setSelectedImages([...selectedImages, uri]);
        } else {
          alert("You can select only up to 5 images.");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleTitleChange = (text) => {
    if (text.length > 100) {
      Alert.alert("Error", "Title of post must be between 1 to 100 characters!");
    } else {
      setTitle(text);
    }
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please select at least one image.");
    } else {
      if (title === "" || description === "" || location === "") {
        Alert.alert("Error", "Please fill in all fields.");
      } else {
        try {
          const data = {
            selectedImages,
            title,
            description,
            location,
          };

          let formData = new FormData();

          const accountId = await AsyncStorage.getItem("accountId");
          formData.append("accountID", accountId);
          formData.append("Title", data.title);
          formData.append("Description", data.description);
          formData.append("Location", data.location);

          selectedImages.forEach((imageUri, index) => {
            formData.append("Image", {
              uri: imageUri,
              type: "image/jpeg",
              name: `image_${index}.jpg`,
            });
          });

          const response = await createPost(formData);

          if (response.status === 200) {
            Alert.alert("Success", "Review submitted successfully!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          } else {
            Alert.alert("Error", "Error creating post.");
          }
        } catch (error) {
          Alert.alert("Error", "Server error, please try again later!");
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentCreateBlog}>
          <Text style={styles.title}>Share a travel moment</Text>
          <Text style={styles.subtitle}>Share your pictures</Text>
          <Text style={styles.description}>
            We encourage you to post photos of popular destinations.
          </Text>
          <View style={styles.previewContainer}>
            {selectedImages.map((imageUri, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.btnRemoveImg}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Image source={images.RemoveIcon} style={styles.removeIcon} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {selectedImages.length < 5 && (
            <TouchableOpacity
              style={styles.uploadContainer}
              onPress={handleImageUpload}
              disabled={selectedImages.length >= 5}
            >
              <View style={styles.uploadInput}>
                <Image source={images.cameraIcon} style={styles.cameraIcon} />
              </View>
              <Text style={styles.pictureCount}>
                {selectedImages.length}/5 images selected
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.addTitle}>Add Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Please Enter The Moment Title"
            value={title}
            onChangeText={handleTitleChange}
          />
          <Text style={styles.tripDescription}>Tell us about your trip</Text>
          <TextInput
            style={styles.tripInput}
            multiline
            numberOfLines={4}
            placeholder="Write your here..."
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.addLocation}>Select Location</Text>
          <Picker
            selectedValue={location}
            style={styles.locationPicker}
            onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
          >
            <Picker.Item label="Select location" value="" />
            <Picker.Item label="Can Tho" value="Can Tho" />
            <Picker.Item label="Ho Chi Minh" value="Ho Chi Minh" />
            <Picker.Item label="Da Nang" value="Da Nang" />
            <Picker.Item label="Quy Nhon" value="Quy Nhon" />
            <Picker.Item label="Ha Noi" value="Ha Noi" />
          </Picker>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isCheckedForThisPost && styles.checkedBox,
              ]}
              onPress={handleCheckboxChange}
            >
              {isCheckedForThisPost && <Text style={styles.checkIcon}>✔</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              By posting, I confirm that these images belong to me and I agree
              to the terms of Eposh.com{" "}
              <Text style={styles.linkText}>Terms and Conditions</Text> &{" "}
              <Text style={styles.linkText}>Community Rules</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              !isCheckedForThisPost && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!isCheckedForThisPost}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#F0F2F5",
  },
  contentCreateBlog: {
    padding: pixelNormalize(10),
    borderRadius: pixelNormalize(10),
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: pixelNormalize(24),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  subtitle: {
    fontSize: pixelNormalize(18),
    marginBottom: pixelNormalize(5),
  },
  description: {
    color: "#A9A9A9",
    fontSize: pixelNormalize(13),
    marginBottom: pixelNormalize(10),
  },
  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imagePreviewWrapper: {
    position: "relative",
    marginRight: pixelNormalize(10),
    marginBottom: pixelNormalize(10),
  },
  previewImage: {
    width: pixelNormalize(100),
    height: pixelNormalize(100),
    borderRadius: pixelNormalize(10),
  },
  btnRemoveImg: {
    position: "absolute",
    top: pixelNormalize(5),
    right: pixelNormalize(5),
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(5),
  },
  removeIcon: {
    width: pixelNormalize(20),
    height: pixelNormalize(20),
  },
  uploadContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00A5F5",
    borderStyle: "dashed",
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(20),
    marginTop: pixelNormalize(10),
    backgroundColor: "#FFFFFF",
  },
  uploadInput: {
    alignItems: "center",
  },
  cameraIcon: {
    width: pixelNormalize(50),
    height: pixelNormalize(50),
  },
  pictureCount: {
    fontSize: pixelNormalize(16),
    marginTop: pixelNormalize(10),
  },
  addTitle: {
    marginTop: pixelNormalize(10),
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  titleInput: {
    backgroundColor: "#FFFFFF",
    padding: pixelNormalize(10),
    borderRadius: pixelNormalize(5),
    borderWidth: 1,
    borderColor: "#A3A3A3",
    marginBottom: pixelNormalize(10),
  },
  tripDescription: {
    marginBottom: pixelNormalize(10),
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
  },
  tripInput: {
    backgroundColor: "#FFFFFF",
    padding: pixelNormalize(10),
    borderRadius: pixelNormalize(5),
    borderWidth: 1,
    borderColor: "#A3A3A3",
    marginBottom: pixelNormalize(10),
    textAlignVertical: "top",
  },
  addLocation: {
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  locationPicker: {
    backgroundColor: "#FFFFFF",
    borderRadius: pixelNormalize(5),
    borderWidth: 1,
    borderColor: "#A3A3A3",
    marginBottom: pixelNormalize(10),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pixelNormalize(10),
  },
  checkbox: {
    width: pixelNormalize(20),
    height: pixelNormalize(20),
    marginRight: pixelNormalize(10),
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#00A5F5",
    borderColor: "#00A5F5",
  },
  checkIcon: {
    color: "#fff",
    fontSize: pixelNormalize(14),
  },
  checkboxText: {
    fontSize: pixelNormalize(14.5),
    width: pixelNormalize(300),
  },
  linkText: {
    color: "#00A5F5",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#00A5F5",
    padding: pixelNormalize(15),
    borderRadius: pixelNormalize(5),
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#DDDDDD",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
  },
});

export default CreateBlog;
