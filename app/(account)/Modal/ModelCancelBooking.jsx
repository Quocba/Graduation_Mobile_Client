import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const ModalCancelBooking = ({ isVisible, onClose, onConfirm, reasons }) => {
  const [selectedReason, setSelectedReason] = useState("");

  const handleConfirmPress = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
    } else {
      Alert.alert("Error", "You must choose one of the reasons below!");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalAtten}>Attention</Text>
          <Text style={styles.modalText}>
            Why do you want to cancel this booking?
          </Text>
          {reasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.reasonButton,
                selectedReason === reason && styles.selectedReasonButton,
              ]}
              onPress={() => setSelectedReason(reason)}
            >
              <Text
                style={[
                  styles.reasonText,
                  selectedReason === reason && styles.selectedReasonText,
                ]}
              >
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={handleConfirmPress}
            >
              <Text style={styles.textStyle}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  buttonConfirm: {
    backgroundColor: "#FF0000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  reasonText: {
    color: "black",
  },
  selectedReasonText: {
    color: "white",
  },
  modalAtten: {
    fontSize: 25,
    marginBottom: 15,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 15,
    marginBottom: 10,
  },
  reasonButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#DDDDDD",
    borderRadius: 8,
  },
  selectedReasonButton: {
    backgroundColor: "#1E90FF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ModalCancelBooking;
