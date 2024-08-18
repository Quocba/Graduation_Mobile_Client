  import React, { useEffect, useState } from "react";
  import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    SafeAreaView,
    ScrollView,
  } from "react-native";
  import { images } from "../../constants";
  import { useNavigation, useFocusEffect } from "@react-navigation/native";
  import { pixelNormalize } from "../../components/Normalize";
  import { URL_IMAGE } from "../../services/ApiUrl";
  import { getAllPost } from "./MomentsLayout.Api";
  import { HeaderLogoTitle } from "../../components/HeaderLogoAndTitle";

  const MomentsLayout = () => {
    const navigation = useNavigation();
    const [hotelPost, setPostData] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("All");
    const header = HeaderLogoTitle(images.logo);

    const fetchData = async () => {
      try {
        const data = await getAllPost();
        const approvedPosts = data.filter((post) => post.status === "Approved");
        setPostData(approvedPosts);
        setFilteredPosts(approvedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Post data:", error);
        setError("Error fetching post data");
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
        fetchData();
      }, [])
    );
  
    useFocusEffect(
      React.useCallback(() => {
        setSelectedLocation("All");
        filterPosts("All");
      }, [hotelPost])
    );

    useEffect(() => {
      navigation.setOptions(header.headerOptions);
    }, [navigation]);

    const navigateToCreateBlog = () => {
      navigation.navigate("CreateBlog");
    };

    const navigateToDetailMoment = (id) => {
      navigation.navigate("MomentDetailPage", { momentId: id });
    };

    const filterPosts = (location) => {
      setSelectedLocation(location);

      let filtered;
      if (location === "All") {
        filtered = [...hotelPost];
      } else {
        filtered = hotelPost.filter((post) => post.location === location);
      }

      setFilteredPosts(filtered);
    };

    if (loading) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Loading...</Text>
        </SafeAreaView>
      );
    }

    if (error) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{error}</Text>
        </SafeAreaView>
      );
    }

    const renderPost = ({ item }) => (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => navigateToDetailMoment(item.blogID)}
      >
        <Image
          source={{ uri: `${URL_IMAGE}${item.blogImages[0].image}` }}
          style={styles.postImage}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <View style={styles.locationContainer}>
            <Text style={styles.postLocation}>{item.location}</Text>
          </View>
          <Text style={styles.postComments}>{item.comments.length} Comments</Text>
        </View>
      </TouchableOpacity>
    );

    const splitIntoRows = (data, numColumns) => {
      const rows = [];
      for (let i = 0; i < data.length; i += numColumns) {
        rows.push(data.slice(i, i + numColumns));
      }
      return rows;
    };

    const postsRows = splitIntoRows(filteredPosts, 2);

    const renderPostRow = ({ item }) => (
      <View style={styles.postsRow}>
        {item.map((post) => (
          <View key={post.blogID} style={styles.postWrapper}>
            {renderPost({ item: post })}
          </View>
        ))}
      </View>
    );

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Posts About Outstanding Places</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToCreateBlog}
          >
            <Text style={styles.addButtonText}>Add Blog</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <View style={styles.filterContainer}>
            {[
              "All",
              "Can Tho",
              "Ho Chi Minh",
              "Da Nang",
              "Quy Nhon",
              "Ha Noi",
            ].map((location) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.filterButton,
                  selectedLocation === location && styles.selectedFilterButton,
                ]}
                onPress={() => filterPosts(location)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedLocation === location &&
                      styles.selectedFilterButtonText,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {filteredPosts.length === 0 ? (
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>No posts found!</Text>
          </View>
        ) : (
          <FlatList
            data={postsRows}
            renderItem={renderPostRow}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.postsList}
          />
        )}
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F0F2F5",
      padding: pixelNormalize(10),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: pixelNormalize(10),
      borderRadius: pixelNormalize(10),
    },
    headerTitle: {
      fontSize: pixelNormalize(16),
      fontWeight: "bold",
    },
    addButton: {
      backgroundColor: "#028AE0",
      paddingVertical: pixelNormalize(10),
      paddingHorizontal: pixelNormalize(15),
      borderRadius: pixelNormalize(8),
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: pixelNormalize(14),
    },
    filterScroll: {
      marginBottom: pixelNormalize(10),
    },
    filterContainer: {
      flexDirection: "row",
      flexWrap: "nowrap",
    },
    filterButton: {
      flex: 1,
      borderRadius: pixelNormalize(10),
      height: pixelNormalize(30),
      paddingHorizontal: pixelNormalize(15),
      backgroundColor: "#FFFFFF",
      marginRight: pixelNormalize(10),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: pixelNormalize(5),
      elevation: pixelNormalize(5),
    },
    selectedFilterButton: {
      backgroundColor: "#028AE0",
    },
    filterButtonText: {
      color: "#000",
      fontSize: pixelNormalize(14),
    },
    selectedFilterButtonText: {
      color: "#FFFFFF",
    },
    postsList: {
      flexGrow: 1,
    },
    postsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: pixelNormalize(15),
    },
    postWrapper: {
      width: "48%",
    },
    postContainer: {
      borderRadius: pixelNormalize(10),
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: pixelNormalize(5),
      elevation: pixelNormalize(5),
    },
    postImage: {
      width: "100%",
      height: pixelNormalize(120),
      borderTopLeftRadius: pixelNormalize(10),
      borderTopRightRadius: pixelNormalize(10),
    },
    contentContainer: {
      padding: pixelNormalize(10),
    },
    postTitle: {
      fontSize: pixelNormalize(16),
      fontWeight: "bold",
      marginBottom: pixelNormalize(8),
    },
    locationContainer: {
      borderWidth: 2,
      borderColor: "#36b8fa",
      borderRadius: 5,
      paddingVertical: pixelNormalize(5),
      paddingHorizontal: pixelNormalize(5),
      textAlign: "center",
      width: "80%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    postLocation: {
      color: "#36b8fa",
      fontSize: pixelNormalize(14),
      fontWeight: "bold",
    },
    postComments: {
      fontSize: pixelNormalize(14),
      color: "#888",
    },
    noPostsContainer: {
      flex: 1,
      top: -150,
      justifyContent: "center",
      alignItems: "center",
    },
    noPostsText: {
      fontSize: 18,
      color: "#888",
      fontWeight: "500",
    },
  });

  export default MomentsLayout;
