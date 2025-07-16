import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getAuthToken } from "../../utils/auth";
import {
  addItemToCartBackend,
  addNewItem,
  addSameItem,
  removeItem,
  removeItemFromCartBackend,
  getCartOnRefresh,
} from "../../provider/redux/slices/cartSlice";
import { useRouter } from "expo-router";
import styles from "../../styles/CartStyles";
import AddressContainer from "../../components/Header/AddressContainer";
import PlaceOrderButton from "../../components/payment/PlaceOrder";
import { BASE_URL } from "../../utils/const";

export default function CartScreen() {
  const [loading, setLoading] = useState(false);
  const currentCart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [packagingFee, setPackagingFee] = useState(0);
  const [orderNote, setOrderNote] = useState(" ");

  const getCharges = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/menus/get-charges`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Failed to fetch charges");
      }
    } catch (error) {
      console.error("Error fetching charges:", error.message);
      throw error;
    }
  };

  const fetchCharges = useCallback(async () => {
    try {
      setLoading(true);
      const chargesData = await getCharges();
      if (chargesData && chargesData.data) {
        setDeliveryFee(chargesData.data.delivery || 0);
        setPackagingFee(chargesData.data.packaging || 0);
        console.log("charges: ", chargesData);
        // Don't log state variables here as they won't reflect new values yet
      } else {
        // Fallback values if data is not in expected format
        setDeliveryFee(0);
        setPackagingFee(0);
      }
    } catch (error) {
      console.error("Failed to fetch charges:", error);
      // Set default values if fetching fails
      setDeliveryFee(0);
      setPackagingFee(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        navigation.navigate("(auth)/signin");
        return;
      }
    };

    checkAuth();
  }, [navigation]);

  // Use useFocusEffect for both cart and charges refresh
  useFocusEffect(
    useCallback(() => {
      dispatch(getCartOnRefresh());
      fetchCharges();

      // This will log updated values after the state has been updated
      return () => {
        console.log("On screen leave - delivery:", deliveryFee);
        console.log("On screen leave - packaging:", packagingFee);
      };
    }, [dispatch, fetchCharges])
  );

  // Effect to log updated values whenever they change
  // useEffect(() => {
  //   console.log("Updated delivery fee:", deliveryFee);
  //   console.log("Updated packaging fee:", packagingFee);
  // }, [deliveryFee, packagingFee]);

  const handleAddItemCart = (item) => {
    const isAlreadyAdded = currentCart.items.some(
      (indItem) => indItem.menu._id === item.menu._id
    );
    if (isAlreadyAdded) {
      dispatch(addSameItem({ menuId: item.menu._id, price: item.menu.price }));
    } else {
      dispatch(
        addNewItem({ menu: item.menu, quantity: item.quantity, _id: item._id })
      );
    }
    dispatch(
      addItemToCartBackend({ menuId: item.menu._id, price: item.menu.price })
    );
  };

  const handleRemoveItemCart = (item) => {
    dispatch(removeItem({ menuId: item.menu._id, price: item.menu.price }));
    dispatch(
      removeItemFromCartBackend({
        menuId: item.menu._id,
        price: item.menu.price,
      })
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.menu.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.menu.name}</Text>
        <Text style={styles.itemPrice}>₹{item.menu.price}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveItemCart(item)}
        >
          <Text style={[styles.actionButtonText, styles.addButtonText]}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => handleAddItemCart(item)}
        >
          <Text style={[styles.actionButtonText, styles.addButtonText]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0AA759" />
      </View>
    );
  }

  if (currentCart?.items.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>Your Cart is Empty</Text>
        <TouchableOpacity
          style={styles.addButtonLarge}
          onPress={() => router.push("/")}
        >
          <Text style={styles.addButtonTextLarge}>Add Items</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate total price including fees
  const totalPrice = currentCart.totalPrice + deliveryFee + packagingFee;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Details</Text>
      <FlatList
        data={currentCart.items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.menu._id}
        initialNumToRender={5}
        contentContainerStyle={styles.cartList}
        ListFooterComponent={() => (
          <>
            <View style={styles.horizontalLine} />
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Sub-Total</Text>
                <Text style={styles.summaryText}>
                  ₹{currentCart.totalPrice}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Delivery Fee</Text>
                <Text style={styles.summaryText}>₹{deliveryFee}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Packaging Fee</Text>
                <Text style={styles.summaryText}>₹{packagingFee}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>₹{totalPrice}</Text>
              </View>
            </View>
          </>
        )}
      />
      <View style={styles.noteContainer}>
        <Text style={styles.nlabel}>Order Note:</Text>
        <TextInput
          style={styles.ninput}
          placeholder="Enter your order note"
          placeholderTextColor="#888"
          value={orderNote}
          onChangeText={(text) => setOrderNote(text)}
        />
      </View>
      <View style={styles.orderPlaceBox}>
        <View style={styles.deliveringto}>
          <Text style={styles.deliveryText}>Delivering to:</Text>
          <AddressContainer />
        </View>
        <PlaceOrderButton orderNote={orderNote} />
      </View>
    </View>
  );
}
