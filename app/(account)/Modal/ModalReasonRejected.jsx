import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

const ModalReasonRejected = ({ isVisible, reason, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Reason for Rejection</Text>
          <Text style={styles.modalTitleText}>
            Your post was rejected because
          </Text>
          <Text style={styles.modalReason}>{reason}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTitleText: {
    marginBottom: 10,
    fontSize: 16,
  },
  modalReason: {
    padding: 10,
    backgroundColor: "#DEF1FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    borderRadius: 5,
    elevation: 5,
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    borderColor: "#00A5F5",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#0085D4",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ModalReasonRejected;
