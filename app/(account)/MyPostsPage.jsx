import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ModalReasonRejected from "./Modal/ModalReasonRejected";
import HeaderNormal from "../../components/HeaderNormal";
import ModalDelete from "./Modal/ModalPostDelete";
import { getAllPostByAccountId, deletePost } from "../(auth)/Auth.Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL_IMAGE } from "../../services/ApiUrl";
import { pixelNormalize } from "../../components/Normalize";

const MyPostsPage = () => {
  const navigation = useNavigation();
  const headerOptions = HeaderNormal({
    title: "My Post",
  }).setHeaderOptions;

  useEffect(() => {
    navigation.setOptions(headerOptions());
  }, [navigation]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [activeFilter]);

  const init = async () => {
    try {
      const accountId = await AsyncStorage.getItem("accountId");
      const res = await getAllPostByAccountId(accountId);
      if (res) {
        setPosts(res);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const splitIntoRows = (data, numColumns) => {
    const rows = [];
    for (let i = 0; i < data.length; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }
    return rows;
  };

  const getStatusStyle = (status) => {
    let statusColor = {};

    switch (status) {
      case "Awaiting Approval":
        statusColor.backgroundColor = "#FFA500";
        break;
      case "Approved":
        statusColor.backgroundColor = "#11D749";
        break;
      case "Rejected":
        statusColor.backgroundColor = "#F14542";
        break;
      default:
        break;
    }

    return statusColor;
  };

  const handlePostPress = (post) => {
    if (post.status === "Rejected") {
      setSelectedPost(post);
      setShowModal(true);
    } else {
      navigation.navigate("MomentDetailPage", {
        momentId: post.blogID,
      });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await deletePost(postId);

      if (response.status === 200) {
        setPosts(posts.filter((p) => p.blogID !== postId));
        setShowDeleteModal(false);
      } else {
        console.error("Error deleting post:", response.status);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const renderPostRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((post, index) => (
        <View key={post.blogID || index} style={styles.postWrapper}>
          {renderPostItem({ item: post })}
        </View>
      ))}
    </View>
  );
  const postRows = splitIntoRows(
    posts.filter((post) => {
      if (activeFilter === "All") {
        return true;
      } else {
        return post.status === activeFilter;
      }
    }),
    2
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${URL_IMAGE}${item?.blogImage[0]?.image}` }}
          style={styles.postImage}
        />
        <Text style={[styles.status, getStatusStyle(item.status)]}>
          {item.status}
        </Text>
        <MaterialIcons
          name="delete"
          size={30}
          color="white"
          style={styles.trashIcon}
          onPress={() => {
            setSelectedPost(item);
            setShowDeleteModal(true);
          }}
        />
      </View>
      <View style={styles.contentTitle}>
        <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
          {item?.title}
        </Text>
        <View style={styles.addressContainer}>
          <Text style={styles.postAddress}>{item?.location}</Text>
        </View>
        <View style={styles.userInfo}>
          <Image
            source={
              item?.account?.avatar?.startsWith("/")
                ? { uri: `${URL_IMAGE}${item?.account?.avatar}` }
                : item?.account?.avatar.includes("https")
                ? { uri: `${item?.account?.avatar}` }
                : require("../../assets/logo.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.userName}>{item?.account?.fullname}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {["All", "Awaiting Approval", "Approved", "Rejected"].map(
            (filter, index) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  index !== 0 && { marginHorizontal: 10 },
                  activeFilter === filter && styles.activeFilter,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {loading ? (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>Loading vouchers...</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : posts.length === 0 ? (
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>No posts available</Text>
        </View>
      ) : (
        <FlatList
          data={postRows}
          renderItem={renderPostRow}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.postsList}
        />
      )}

      <ModalReasonRejected
        isVisible={showModal && selectedPost !== null}
        reason={selectedPost ? selectedPost.reasonReject : ""}
        onClose={() => setShowModal(false)}
      />
      <ModalDelete
        isVisible={showDeleteModal && selectedPost !== null}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => handleDeletePost(selectedPost.blogID)}
        postTitle={selectedPost ? selectedPost.title : ""}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  filterScrollContent: {
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  activeFilter: {
    borderBottomWidth: 1,
    borderBottomColor: "#00A5F5",
  },
  activeFilterText: {
    color: "#00A5F5",
  },
  postsList: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  postWrapper: {
    width: "48%",
  },
  postItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  status: {
    position: "absolute",
    top: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    fontWeight: "bold",
    padding: 5,
  },
  trashIcon: {
    position: "absolute",
    top: 10,
    right: 2,
  },
  contentTitle: {
    padding: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  addressContainer: {
    borderWidth: 2,
    borderColor: "#00A5F5",
    borderRadius: 5,
    alignSelf: "flex-start",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: pixelNormalize(5),
    paddingHorizontal: pixelNormalize(5),
  },
  postAddress: {
    textAlign: "center",
    color: "#028AE0",
    maxWidth: "70%",
    fontWeight: "bold",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#000000",
  },
  userName: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    maxWidth: "70%",
  },
});

export default MyPostsPage;
