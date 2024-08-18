import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { images } from "../../constants";
import { pixelNormalize } from "../../components/Normalize";
import * as ImagePicker from "expo-image-picker";
import { getBookingDetails, createFeedback } from "../(auth)/Auth.Api";
import { URL_IMAGE } from "../../services/ApiUrl";
import {
  calculateNights,
  formatDateWithWeekDay,
  formatPhoneNumber,
  formatPriceWithType,
} from "../../utils/helper";

const BookingDetailCompleted = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingCompletedId } = route.params;
  const [error, setError] = useState(null);
  const [
    bookingDetailAwaitingCompletedId,
    setBookingDetailAwaitingCompletedId,
  ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRoomDetailsExpanded, setRoomDetailsExpanded] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const toggleRoomDetails = () => {
    setRoomDetailsExpanded(!isRoomDetailsExpanded);
  };
  const nights = calculateNights(
    bookingDetailAwaitingCompletedId?.checkInDate,
    bookingDetailAwaitingCompletedId?.checkOutDate
  );

  React.useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const headerOptions = HeaderNormal({
    title: "Completed",
  }).setHeaderOptions;
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const handleRating = (stars) => {
    setRating(stars);
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
        if (selectedImages.length < 1) {
          setSelectedImages([...selectedImages, uri]);
        } else {
          alert("You can select only up to 1 images.");
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

  const handleReviewContentChange = (text) => {
    setReviewContent(text);
  };

  const fetchBookingDetails = async () => {
    try {
      const res = await getBookingDetails(bookingCompletedId);
      if (res) {
        setBookingDetailAwaitingCompletedId(res);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      Alert.alert("Error", "Failed to fetch booking details.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const handleReviewHotel = async () => {
    if (hasReviewed) {
      return;
    }
    if (rating === 0) {
      Alert.alert(
        "Error",
        "You must rate how many stars for your experience in this hotel before send!"
      );
      return;
    } else if (
      reviewContent.trim().length < 1 ||
      reviewContent.trim().length > 300
    ) {
      Alert.alert(
        "Error",
        "Review content must be between 1 and 300 characters."
      );
      return;
    }

    setDisabledButton(true);
    try {
      let formData = new FormData();

      selectedImages.forEach((imageUri, index) => {
        formData.append("Image", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      formData.append("BookingID", bookingCompletedId);
      formData.append("Rating", rating);
      formData.append("Description", reviewContent);

      const response = await createFeedback(formData);

      if (response.status === 200) {
        Alert.alert("Success", "Review submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              setHasReviewed(true);
              setDisabledButton(false);
              setRating(0);
              setReviewContent("");
              setSelectedImages([]);
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          "Failed to submit review. Please try again later."
        );
        setDisabledButton(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "An error occurred while submitting the review.");
      setDisabledButton(false);
    }
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.topSection}>
            <Text
              style={styles.bookingNo}
            >{`Booking No. ${bookingDetailAwaitingCompletedId.bookingID}`}</Text>
            <Text style={[styles.status, styles.statusCompleted]}>
              {bookingDetailAwaitingCompletedId.status}
            </Text>
          </View>

          <Text style={styles.sectionTitleRoom}>
            {bookingDetailAwaitingCompletedId.room?.typeOfRoom}
          </Text>
          <View style={styles.rowSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Check-in</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(
                  bookingDetailAwaitingCompletedId.checkInDate
                )}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Check-out</Text>
              <Text style={styles.text}>
                {formatDateWithWeekDay(
                  bookingDetailAwaitingCompletedId.checkOutDate
                )}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Night</Text>
              <Text style={styles.text}>
                {calculateNights(
                  bookingDetailAwaitingCompletedId.checkInDate,
                  bookingDetailAwaitingCompletedId.checkOutDate
                ) === 1
                  ? `${calculateNights(
                      bookingDetailAwaitingCompletedId.checkInDate,
                      bookingDetailAwaitingCompletedId.checkOutDate
                    )} night`
                  : `${calculateNights(
                      bookingDetailAwaitingCompletedId.checkInDate,
                      bookingDetailAwaitingCompletedId.checkOutDate
                    )} nights`}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text style={styles.textRoomGues}>Rooms:</Text>
              <Text style={styles.text}>
                {bookingDetailAwaitingCompletedId?.room?.numberOfBed}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.textRoomGues}>Guests:</Text>
              <Text style={styles.text}>
                {
                  bookingDetailAwaitingCompletedId?.bookingAccount?.profile
                    ?.fullName
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleInfor}>Contact Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.text}>
              {
                bookingDetailAwaitingCompletedId?.bookingAccount?.profile
                  ?.fullName
              }
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.text}>
              {bookingDetailAwaitingCompletedId?.bookingAccount?.email}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.text}>
              {bookingDetailAwaitingCompletedId?.bookingAccount?.phone}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowhotel}>
            <Image
              source={{
                uri: `${URL_IMAGE}${bookingDetailAwaitingCompletedId?.room?.hotel?.mainImage}`,
              }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>
                {bookingDetailAwaitingCompletedId?.room?.hotel?.name}
              </Text>
              <Text style={styles.address}>
                {
                  bookingDetailAwaitingCompletedId?.room?.hotel?.hotelAddress
                    ?.address
                }
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Type of Room:</Text>
                <Text style={styles.text}>
                  {bookingDetailAwaitingCompletedId?.room?.typeOfRoom}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Bed:</Text>
                <Text style={styles.text}>
                  {bookingDetailAwaitingCompletedId?.room?.numberOfBed <= 1
                    ? `${bookingDetailAwaitingCompletedId?.room?.numberOfBed} ${bookingDetailAwaitingCompletedId?.room?.typeOfBed} Bed`
                    : `${bookingDetailAwaitingCompletedId?.room?.numberOfBed} ${bookingDetailAwaitingCompletedId?.room?.typeOfBed} Beds`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelCantant}>Price For:</Text>
                <Text style={styles.text}>
                  {bookingDetailAwaitingCompletedId?.numberOfGuest <= 1
                    ? `${bookingDetailAwaitingCompletedId?.numberOfGuest} person`
                    : `${bookingDetailAwaitingCompletedId?.numberOfGuest} people`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Call Hotel:</Text>
                <Text style={styles.text}>
                  {formatPhoneNumber(
                    bookingDetailAwaitingCompletedId?.room?.hotel?.parnerAccount
                      ?.phone
                  )}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email Hotel:</Text>
                <Text style={styles.text}>
                  {
                    bookingDetailAwaitingCompletedId?.room?.hotel?.parnerAccount
                      ?.email
                  }
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.priceDetails}>
            <Text style={styles.TitlePriceDetail}>Price Details</Text>
            <TouchableOpacity
              style={styles.rowTitleWithArrow}
              onPress={toggleRoomDetails}
            >
              <Text style={styles.labelCantantPriceDetails}>Room</Text>
              <Text style={styles.arrow}>
                {isRoomDetailsExpanded ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {isRoomDetailsExpanded && (
              <>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>Each Room</Text>
                  <Text style={styles.text}>
                    {bookingDetailAwaitingCompletedId?.unitPrice
                      ? formatPriceWithType(
                          Math.ceil(bookingDetailAwaitingCompletedId?.unitPrice)
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Total{nights > 1 ? `Nights` : `Night`} ({nights})
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetailAwaitingCompletedId?.unitPrice && nights
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailAwaitingCompletedId?.unitPrice * nights
                          )
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Booked Rooms(
                    {bookingDetailAwaitingCompletedId?.numberOfRoom})
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetailAwaitingCompletedId?.unitPrice &&
                    bookingDetailAwaitingCompletedId?.numberOfRoom
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailAwaitingCompletedId?.unitPrice *
                              bookingDetailAwaitingCompletedId?.numberOfRoom
                          )
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
                <View style={styles.rowTitelRoom}>
                  <Text style={styles.labelCantantPriceDetails}>
                    Total Price Room
                  </Text>
                  <Text style={styles.text}>
                    {bookingDetailAwaitingCompletedId?.unitPrice &&
                    bookingDetailAwaitingCompletedId?.numberOfRoom &&
                    nights
                      ? formatPriceWithType(
                          Math.ceil(
                            bookingDetailAwaitingCompletedId?.unitPrice *
                              bookingDetailAwaitingCompletedId?.numberOfRoom *
                              nights
                          )
                        )
                      : 0}{" "}
                    VND
                  </Text>
                </View>
              </>
            )}
            <View style={styles.rowTitel}>
              <Text style={styles.labelCantantPriceDetails}>Service Fee</Text>
              <Text style={styles.text}>
                {bookingDetailAwaitingCompletedId?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(
                        bookingDetailAwaitingCompletedId?.unitPrice *
                          bookingDetailAwaitingCompletedId?.numberOfRoom *
                          nights *
                          0.1
                      )
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
            <View style={styles.rowTitel}>
              <Text style={styles.labelCantantPriceDetails}>Taxes </Text>
              <Text style={styles.text}>
                {bookingDetailAwaitingCompletedId?.taxesPrice
                  ? formatPriceWithType(
                      Math.ceil(bookingDetailAwaitingCompletedId?.taxesPrice)
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
            {bookingDetailAwaitingCompletedId?.voucher && (
              <View style={styles.rowTitel}>
                <Text style={styles.labelCantantPriceDetails}>Voucher</Text>
                <Text style={styles.textVoucher}>
                  -{" "}
                  {formatPriceWithType(
                    Math.ceil(
                      (bookingDetailAwaitingCompletedId?.unitPrice *
                        bookingDetailAwaitingCompletedId?.numberOfRoom *
                        nights +
                        bookingDetailAwaitingCompletedId?.taxesPrice +
                        bookingDetailAwaitingCompletedId?.unitPrice *
                          bookingDetailAwaitingCompletedId?.numberOfRoom *
                          nights *
                          0.1) *
                        (bookingDetailAwaitingCompletedId?.voucher?.discount /
                          100)
                    )
                  )}{" "}
                  VND
                </Text>
              </View>
            )}
            <View style={styles.rowTitelTotelPrice}>
              <Text style={styles.labelCantant}>Total Price</Text>
              <Text style={styles.texttotalPrice}>
                {" "}
                {bookingDetailAwaitingCompletedId?.totalPrice
                  ? formatPriceWithType(
                      Math.ceil(bookingDetailAwaitingCompletedId?.totalPrice)
                    )
                  : 0}{" "}
                VND
              </Text>
            </View>
          </View>
        </View>
        {bookingDetailAwaitingCompletedId?.status === "Completed" &&
        bookingDetailAwaitingCompletedId?.feedbacks?.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitleInfor}>Your Review</Text>
            <TouchableOpacity style={styles.reviewContainer}>
              <View style={styles.previewContainer}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imagePreviewWrapper}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.btnRemoveImg}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Image
                        source={images.RemoveIcon}
                        style={styles.removeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              {selectedImages.length < 1 && (
                <TouchableOpacity
                  style={styles.uploadContainer}
                  onPress={handleImageUpload}
                  disabled={selectedImages.length >= 1}
                >
                  <View style={styles.uploadInput}>
                    <Image
                      source={images.cameraIcon}
                      style={styles.cameraIcon}
                    />
                  </View>
                  <Text style={styles.pictureCount}>
                    {selectedImages.length} / 1 Images
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.reviewContent}>
                <Text style={styles.reviewRatingTitle}>Rating:</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRating(star)}
                      activeOpacity={0.7}
                      style={styles.starButton}
                    >
                      <Image
                        source={
                          star <= rating
                            ? require("../../assets/star1.png")
                            : require("../../assets/star2.png")
                        }
                        style={styles.starIcon}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.reviewLabel}>Your Rating: {rating}/5</Text>
                <TextInput
                  placeholder="Write your review here..."
                  style={styles.reviewInput}
                  multiline
                  numberOfLines={4}
                  value={reviewContent}
                  onChangeText={handleReviewContentChange}
                />
                {hasReviewed && (
                  <View style={styles.reviewedMessageContainer}>
                    <Text style={styles.reviewedMessageText}>
                      You have already reviewed this booking.
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleReviewHotel}
                  disabled={disabledButton}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sectionreview}>
            <View style={styles.reviewedMessageContainer}>
              <Text style={styles.reviewedMessageText}>
                You have already reviewed and rated this booking.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF5FF",
    padding: 10,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bookingNo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusCompleted: {
    color: "#11D749",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    paddingVertical: 10,
    elevation: 5,
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  sectionreview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    paddingVertical: 10,
    elevation: 5,
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 5,
    color: "#A9A9A9",
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  textVoucher: {
    fontSize: 14,
    marginBottom: 5,
    color: "#F14542",
    fontWeight: "bold",
  },
  textRoomGues: {
    fontSize: 14,
    marginRight: 20,
    marginBottom: 5,
    color: "#A9A9A9",
  },
  sectionTitleRoom: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  TitlePriceDetail: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  sectionTitleInfor: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  rowSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    marginRight: -100,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rowTitel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  rowTitelTotelPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelCantant: {
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    fontWeight: "bold",
  },
  hotelImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 5,
  },
  roomType: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceDetails: {
    borderWidth: 2,
    padding: 10,
    borderColor: "#A9A9A9",
    borderRadius: 10,
  },
  total: {
    fontWeight: "bold",
  },

  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHotelName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reviewRatingTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  starButton: {
    marginRight: 5,
  },
  starIcon: {
    width: 30,
    height: 30,
  },
  reviewLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  previewContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreviewWrapper: {
    width: pixelNormalize(320),
    height: pixelNormalize(200),
    position: "relative",
    borderRadius: pixelNormalize(10),
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: pixelNormalize(10),
    overflow: "hidden",
  },
  btnRemoveImg: {
    position: "absolute",
    top: pixelNormalize(3),
    right: pixelNormalize(3),
  },
  removeIcon: {
    width: pixelNormalize(20),
    height: pixelNormalize(20),
    borderRadius: pixelNormalize(10),
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
  reviewInput: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    textAlignVertical: "top",
  },
  confirmButton: {
    backgroundColor: "#00A5F5",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  rowTitleWithArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
    marginBottom: 10,
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rowTitelRoom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginLeft: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#A3A3A3",
  },
  texttotalPrice: {
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewedMessageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  reviewedMessageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingDetailCompleted;
