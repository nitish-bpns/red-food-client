import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import styles from "../../styles/MenuStyles";

export default function FavoriteList({
  favorites,
  removeFavorite,
  updateCart,
  cart,
  restroStatus,
}) {
  // Function to determine if an item is available
  const isItemAvailable = (item) => {
    return restroStatus !== "Closed" && item.isAvailable !== false;
  };

  return (
    <FlatList
      data={favorites}
      contentContainerStyle={{ paddingBottom: 80 }}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.menuCard}>
          {/* Left Side */}
          <View style={styles.leftHalf}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={styles.priceFavoriteContainer}>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <TouchableOpacity
                style={styles.removeFavoriteButton}
                onPress={() => removeFavorite(item._id)}
              >
                <Text style={styles.removeFavoriteText}>
                  Remove from Favorites
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Right Side */}
          <View style={styles.rightHalf}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            {isItemAvailable(item) ? (
              cart.items.some((cartItem) => cartItem.menu._id === item._id) ? (
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    onPress={() => updateCart(item, -1)}
                    style={[styles.counterButton, styles.counterButtonMinus]}
                  >
                    <Text style={styles.counterButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemCount}>
                    {
                      cart.items.find(
                        (cartItem) => cartItem.menu._id === item._id
                      ).quantity
                    }
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateCart(item, 1)}
                    style={[styles.counterButton, styles.counterButtonPlus]}
                  >
                    <Text style={styles.counterButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => updateCart(item, 1)}
                >
                  <Text style={styles.addButtonText}>ADD</Text>
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
      )}
    />
  );
}
