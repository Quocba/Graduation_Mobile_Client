import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderNormal from "../../components/HeaderNormal";
import { pixelNormalize } from "../../components/Normalize";
import { getPostDetails, commentPost } from "./MomentsLayout.Api";
import { getProfile } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AllImagesModal from "./ModelImage";
import { checkLogin, formatDate, renderDescription } from "../../utils/helper";
import { URL_IMAGE } from "../../services/ApiUrl";
import { themeColors } from "../../utils/theme/ThemeColor";

const MomentDetailPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [momentData, setMomentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showAllImagesModal, setShowAllImagesModal] = useState(false);
  const pollInterval = 5000;
  const [userData, setUserData] = useState(null);
  const [displayedComments, setDisplayedComments] = useState(5);

  const blogId = route.params?.momentId;
  const headerOptions = HeaderNormal({
    title: "Moment Detail",
  }).setHeaderOptions;
  useLayoutEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  useEffect(() => {
    const fetchMomentData = async () => {
      try {
        setLoading(true);
        const data = await getPostDetails(blogId);
        setMomentData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching moment data:", error);
        setError("Error fetching moment data!");
        setLoading(false);
      }
    };

    if (blogId) {
      fetchMomentData();
    } else {
      setLoading(false);
      setError("Invalid moment ID!");
    }
  }, [blogId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accountId = await AsyncStorage.getItem("accountId");
        const res = await getProfile(accountId);
        if (res) {
          setUserData(res);
        } else {
          console.error("Error fetching profile: Data not found!");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login...");
          navigation.navigate("Login");
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const pollData = async () => {
    try {
      const data = await getPostDetails(blogId);
      setMomentData(data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching moment data:", error);
      setError("Error fetching moment data!");
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(pollData, pollInterval);
    return () => clearInterval(intervalId);
  }, [blogId]);

  const handleSendComment = async () => {
    if (commentText.trim() !== "") {
      if (commentText.length > 500) {
        Alert.alert(
          "Comment Limit Exceeded",
          "Please limit your comment to 500 characters!"
        );
        return;
      }

      try {
        let formData = new FormData();
        formData.append("blogId", blogId);
        formData.append("accountId", await AsyncStorage.getItem("accountId"));
        formData.append("description", commentText);

        const res = await commentPost(formData);
        Alert.alert("Success", "Comment posted successfully!");
        setCommentText("");
      } catch (error) {
        console.error("Error posting comment:", error);
        Alert.alert("Error", "Failed to post comment. Please try again!");
      }
    } else {
      Alert.alert("Empty Comment", "Please enter a comment!");
    }
  };
  const openAllImagesModal = () => {
    setShowAllImagesModal(true);
  };

  const closeAllImagesModal = () => {
    setShowAllImagesModal(false);
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

  if (!momentData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Moment not found!</Text>
      </SafeAreaView>
    );
  }

  const handleSeeMoreComments = () => {
    setDisplayedComments((prevDisplayedComments) => prevDisplayedComments + 5);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.containMomentDetail}>
          <View style={styles.imageContainer}>
            <View style={styles.bigImageContainer}>
              <Image
                source={{
                  uri: `${URL_IMAGE}${momentData.blogImages[0].image}`,
                }}
                style={styles.bigImage}
              />
            </View>
            <View style={styles.smallImagesContainer}>
              {momentData.blogImages.slice(1, 3).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: `${URL_IMAGE}${image.image}` }}
                  style={styles.smallImage}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.viewAllImagesButton}
              onPress={openAllImagesModal}
            >
              <Text style={styles.viewAllImagesText}>View All Images</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 6,
              width: "100%",
              height: 0.5,
              borderWidth: 0.3,
              borderColor: themeColors.gray,
            }}
          ></View>
          <Text style={styles.title}>{momentData.title}</Text>
          <Text style={styles.commentsCount}>
            {momentData.comments.length} Comments
          </Text>
          <Text style={styles.location}>{momentData.location}</Text>
          <View style={styles.description}>
            {renderDescription(momentData.description)}
          </View>
          <View
            style={{
              marginVertical: 6,
              width: "100%",
              height: 0.5,
              borderWidth: 0.3,
              borderColor: themeColors.gray,
            }}
          ></View>
          <Text style={styles.visitorCommentsTitle}>
            Comments from visitors:
          </Text>
          <View style={styles.commentVisitor}>
            {momentData.comments.length !== 0 ? (
              <>
                {momentData.comments
                  .slice(0, displayedComments)
                  .map((comment) => (
                    <View
                      key={`comment_${comment.commentID}`}
                      style={styles.commentContainer}
                    >
                      <Image
                        key={`comment_image_${comment.commentID}`}
                        source={
                          comment?.account?.profile?.avatar?.startsWith("/", 0)
                            ? {
                                uri: `${URL_IMAGE}${comment?.account?.profile?.avatar}`,
                              }
                            : comment?.account?.profile?.avatar?.includes(
                                "https"
                              )
                            ? { uri: `${comment?.account?.profile?.avatar}` }
                            : require("../../assets/logo.png")
                        }
                        style={styles.avatar}
                      />
                      <View style={styles.commentTextContainer}>
                        <Text style={styles.visitorName}>
                          {comment.account.profile.fullName}
                        </Text>
                        <Text style={styles.visitorComment}>
                          {comment.description}
                        </Text>
                        <Text style={styles.visitorDate}>
                          {formatDate(comment.dateComment)}
                        </Text>
                      </View>
                    </View>
                  ))}
                {displayedComments < momentData.comments.length && (
                  <TouchableOpacity
                    onPress={handleSeeMoreComments}
                    style={styles.seeMoreButton}
                  >
                    <Text style={styles.seeMoreText}>See More Comments</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 6 }}>
                <Text style={{ fontSize: 18 }}>No comment in this post!</Text>
              </View>
            )}
          </View>
          <View
            style={{
              marginVertical: 6,
              width: "100%",
              height: 0.5,
              borderWidth: 0.3,
              borderColor: themeColors.gray,
            }}
          ></View>
          {checkLogin() &&
          momentData?.account?.accountID !== userData?.accountID ? (
            <>
              <Text style={styles.yourCommentTitle}>Your Comment:</Text>
              <View style={styles.commentInputContainer}>
                <Image
                  source={
                    userData?.profile?.avatar?.startsWith("/", 0)
                      ? { uri: `${URL_IMAGE}${userData?.profile?.avatar}` }
                      : userData?.profile?.avatar?.includes("https")
                      ? { uri: `${userData?.profile?.avatar}` }
                      : require("../../assets/logo.png")
                  }
                  style={styles.avatar}
                />
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendComment}
                >
                  <Icon name="send" style={styles.sendIcon} />
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <AllImagesModal
        visible={showAllImagesModal}
        closeModal={closeAllImagesModal}
        images={momentData.blogImages}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: pixelNormalize(10),
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
  },
  containMomentDetail: {
    padding: pixelNormalize(10),
    borderRadius: pixelNormalize(10),
    backgroundColor: "#FFFFFF",
  },
  imageContainer: {
    marginBottom: pixelNormalize(10),
  },
  bigImageContainer: {
    marginBottom: pixelNormalize(10),
  },
  bigImage: {
    width: "100%",
    height: pixelNormalize(200),
    borderRadius: pixelNormalize(10),
    marginBottom: pixelNormalize(10),
  },
  smallImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: pixelNormalize(10),
  },
  smallImage: {
    width: "48%",
    height: pixelNormalize(150),
    borderRadius: pixelNormalize(10),
  },
  viewAllImagesButton: {
    alignItems: "center",
    padding: pixelNormalize(10),
  },
  viewAllImagesText: {
    color: "#028AE0",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
  title: {
    fontSize: pixelNormalize(24),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  commentsCount: {
    borderBottomWidth: pixelNormalize(1),
    borderBottomColor: "#A3A3A3",
    fontSize: pixelNormalize(16),
    paddingBottom: pixelNormalize(5),
    marginBottom: pixelNormalize(10),
  },
  location: {
    borderWidth: 2,
    borderColor: "#028AE0",
    borderRadius: pixelNormalize(8),
    paddingVertical: pixelNormalize(5),
    textAlign: "center",
    color: "#028AE0",
    width: "30%",
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  visitorCommentsTitle: {
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  commentVisitor: {
    marginBottom: pixelNormalize(10),
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: pixelNormalize(10),
  },
  avatar: {
    width: pixelNormalize(50),
    height: pixelNormalize(50),
    borderRadius: pixelNormalize(25),
    marginRight: pixelNormalize(10),
  },
  commentTextContainer: {
    flex: 1,
    backgroundColor: "#DEF1FF",
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(10),
  },
  visitorName: {
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
    marginBottom: pixelNormalize(5),
  },
  visitorComment: {
    fontSize: pixelNormalize(14),
    marginBottom: pixelNormalize(5),
  },
  visitorDate: {
    fontSize: pixelNormalize(12),
    color: "#A3A3A3",
  },
  yourCommentTitle: {
    fontSize: pixelNormalize(18),
    fontWeight: "bold",
    marginBottom: pixelNormalize(10),
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pixelNormalize(10),
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: pixelNormalize(10),
    padding: pixelNormalize(10),
    marginRight: pixelNormalize(10),
  },
  sendButton: {
    backgroundColor: "#028AE0",
    padding: pixelNormalize(10),
    borderRadius: pixelNormalize(10),
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: pixelNormalize(20),
  },
  seeMoreButton: {
    alignItems: "center",
    padding: pixelNormalize(10),
  },
  seeMoreText: {
    color: "#028AE0",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
});

export default MomentDetailPage;
