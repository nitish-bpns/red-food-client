import React, { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/MenuStyles";
import VerticalSpacer from "../VerticalSpacer";

export default function MenuList({
  menu,
  activeFilter,
  searchText,
  cart,
  updateCart,
  toggleModal,
  restroStatus,
}) {
  const [expandedCategories, setExpandedCategories] = useState(() =>
    menu.slice(0, 2).map((category) => category.category._id)
  );
  // console.log(restroStatus);

  // Function to determine if an item is available
  const isItemAvailable = (item) => {
    return restroStatus !== "Closed" && item.isAvailable !== false;
  };

  // Check and remove unavailable items from cart
  useEffect(() => {
    // Find items in cart that are no longer available
    const unavailableCartItems = cart.items.filter(
      (cartItem) => !isItemAvailable(cartItem.menu)
    );

    // Remove each unavailable item from cart
    unavailableCartItems.forEach((cartItem) => {
      // Set quantity to 0 to remove item completely
      updateCart(cartItem.menu, -cartItem.quantity);
    });
  }, [cart.items, menu, restroStatus]);

  // Calculate filtered categories
  const filteredCategories = menu
    .map((category) => ({
      ...category,
      menus: category.menus.filter((item) => {
        const matchesFilter =
          activeFilter === "all" || item.tag.toLowerCase() === activeFilter;
        const matchesSearch =
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase());
        return matchesFilter && matchesSearch;
      }),
    }))
    .filter((category) => category.menus.length > 0);

  // Update expanded categories when filters change
  useEffect(() => {
    if (filteredCategories.length < menu.length || searchText.trim() !== "") {
      // Expand all filtered categories when search or filter is applied
      setExpandedCategories(
        filteredCategories.map((category) => category.category._id)
      );
    } else {
      // Reset to default state when all categories are showing
      setExpandedCategories(
        menu.slice(0, 2).map((category) => category.category._id)
      );
    }
  }, [filteredCategories.length, searchText, activeFilter, menu]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <>
      <FlatList
        data={filteredCategories}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyExtractor={(item) => item.category._id}
        renderItem={({ item: category }) => (
          <View style={styles.categoryContainer}>
            {/* Category Header */}
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.category._id)}
            >
              <Text style={styles.categoryTitle}>{category.category.name}</Text>
              <Ionicons
                name={
                  expandedCategories.includes(category.category._id)
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={20}
                color="#333"
              />
            </TouchableOpacity>

            {/* Category Menus */}
            {expandedCategories.includes(category.category._id) &&
              category.menus.map((item) => (
                <View key={item._id} style={styles.menuCard}>
                  {/* Menu Item Left Side */}
                  <TouchableOpacity
                    style={styles.leftHalf}
                    onPress={() => toggleModal(item)}
                  >
                    <View style={styles.nameContainer}>
                      <View
                        style={[
                          styles.vegIndicator,
                          {
                            backgroundColor:
                              item.tag === "Veg" ? "green" : "red",
                          },
                        ]}
                      />
                      <Text style={styles.itemName}>{item.name}</Text>
                    </View>
                    <Text style={styles.itemDescription}>
                      {item.description}
                    </Text>
                    <View style={styles.priceFavoriteContainer}>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Menu Item Right Side */}
                  <View style={styles.rightHalf}>
                    <TouchableOpacity onPress={() => toggleModal(item)}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                      />
                    </TouchableOpacity>

                    {/* Cart Counter or Add/Not Available Button */}
                    {isItemAvailable(item) ? (
                      cart.items.some(
                        (cartItem) => cartItem.menu._id === item._id
                      ) ? (
                        <View style={styles.counterContainer}>
                          <TouchableOpacity
                            onPress={() => updateCart(item, -1)}
                            style={[
                              styles.counterButton,
                              styles.counterButtonMinus,
                            ]}
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
                            style={[
                              styles.counterButton,
                              styles.counterButtonPlus,
                            ]}
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
              ))}
          </View>
        )}
      />
    </>
  );
}
