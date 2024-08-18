import React from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { pixelNormalize } from "../../components/Normalize";
import { URL_IMAGE } from "../../services/ApiUrl";

const AllImagesModal = ({ visible, closeModal, images }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView>
          <View style={styles.modalContent}>
            {images.map((image, index) => (
              <Image
                key={`modal_image_${index}`}
                source={{ uri: `${URL_IMAGE}${image.image}` }}
                style={styles.modalImage}
              />
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
          <Text style={styles.closeModalText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  modalContent: {
    padding: pixelNormalize(10),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modalImage: {
    width: "100%",
    height: pixelNormalize(200),
    borderRadius: pixelNormalize(10),
    marginBottom: pixelNormalize(10),
  },
  closeModalButton: {
    alignItems: "center",
    padding: pixelNormalize(10),
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  closeModalText: {
    color: "#028AE0",
    fontSize: pixelNormalize(16),
    fontWeight: "bold",
  },
});

export default AllImagesModal;
