import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/MenuStyles";

const MenuModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  toggleFavorite,
  updateCart,
  cart,
  favorites,
  restroStatus,
}) => {
  // Function to determine if an item is available (same as in MenuList)
  const isItemAvailable = (item) => {
    return restroStatus !== "Closed" && item.isAvailable !== false;
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.bottomModalContent}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="#E23744" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedItem.image }}
            style={styles.modalImage}
          />
          <View style={styles.modalDetailsContainer}>
            <View style={styles.nameContainer}>
              <View
                style={[
                  styles.vegIndicator,
                  {
                    backgroundColor:
                      selectedItem.tag === "Veg" ? "green" : "red",
                  },
                ]}
              />
              <Text style={styles.itemName}>{selectedItem.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  toggleFavorite(selectedItem._id);
                }}
                style={styles.heartButton}
              >
                <Ionicons
                  name="heart"
                  size={20}
                  color={
                    favorites[selectedItem._id] || selectedItem.isFavorite
                      ? "red"
                      : "lightgrey"
                  }
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.itemDescription}>
              {selectedItem.description}
            </Text>
            <Text style={styles.itemPriceModal}>₹{selectedItem.price}</Text>
          </View>
          {isItemAvailable(selectedItem) ? (
            cart.items.some(
              (cartItem) => cartItem.menu._id === selectedItem._id
            ) ? (
              <View style={styles.counterContainerModal}>
                <TouchableOpacity
                  onPress={() => updateCart(selectedItem, -1)}
                  style={[styles.counterButton, styles.counterButtonMinus]}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.itemCount}>
                  {
                    cart.items.find(
                      (cartItem) => cartItem.menu._id === selectedItem._id
                    ).quantity
                  }
                </Text>
                <TouchableOpacity
                  onPress={() => updateCart(selectedItem, 1)}
                  style={[styles.counterButton, styles.counterButtonPlus]}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButtonModal}
                onPress={() => updateCart(selectedItem, 1)}
              >
                <Text style={styles.addButtonText}>ADD TO CART</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.notAvailableButton}>
              <Text style={styles.notAvailableText}>Not</Text>
              <Text style={styles.notAvailableText}>Available</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default MenuModal;
