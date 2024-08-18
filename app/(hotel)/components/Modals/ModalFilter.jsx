import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ModalContent } from "react-native-modals";
import { Fontisto } from "@expo/vector-icons";
import { dataHotelAmenities } from "../../../../utils/dataSet";
import { themeColors } from "../../../../utils/theme/ThemeColor";

const ModalFilter = ({ selectedServices, setSelectedServices }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [itemWidths, setItemWidths] = useState([]);
  const flatListRef = useRef(null);
  const itemRefs = useRef([]);

  const services = dataHotelAmenities.map((amenity) => amenity?.serviceType);

  const handleSelectedCheckBox = (serviceType, index) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceType]: !prev[serviceType],
    }));
    setActiveIndex(index);

    const itemsPerRow = 1; // Number of items per row
    const visibleItems = 3; // Number of items to show in a row
    const totalItems = services?.length;
    const totalRows = Math.ceil(totalItems / itemsPerRow);

    // Calculate the new row
    const currentRow = Math.floor(index / itemsPerRow);
    let newRow = currentRow + 1;

    // If newRow exceeds total rows, reset to 0
    if (newRow >= totalRows) {
      newRow = 0;
    }

    // Calculate the offset to scroll to
    const totalWidth = itemWidths.reduce((acc, width) => acc + width, 0);
    const visibleWidth = itemWidths
      .slice(0, visibleItems)
      .reduce((acc, width) => acc + width, 0);
    const maxScroll = Math.max(totalWidth - visibleWidth, 0);
    const offset = Math.min(
      itemWidths
        .slice(0, newRow * itemsPerRow)
        .reduce((acc, width) => acc + width, 0),
      maxScroll
    );

    flatListRef.current.scrollToOffset({
      offset: offset,
      animated: true,
    });
  };

  const handleItemLayout = (index, event) => {
    const { width } = event.nativeEvent.layout;
    setItemWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectedCheckBox(item, index)}
      onLayout={(event) => handleItemLayout(index, event)}
      ref={(ref) => (itemRefs.current[index] = ref)}
    >
      {!selectedServices[item] ? (
        <Fontisto name="checkbox-passive" size={18} color={themeColors.black} />
      ) : (
        <Fontisto name="checkbox-active" size={18} color={themeColors.black} />
      )}
      <Text aria-valuetext={activeIndex} style={styles.itemText}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ModalContent style={styles.modalContent}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={services}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.flatListContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ModalContent>
  );
};

export default ModalFilter;

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
    height: "auto",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flatListContent: {
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 18,
  },
});
