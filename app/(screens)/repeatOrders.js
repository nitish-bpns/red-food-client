import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import BottomTab from "../../components/BottomTab";
import { Ionicons } from "@expo/vector-icons";
import { getAuthToken } from "../../utils/auth";
import { useNavigation } from "@react-navigation/native";
import { getCartOnRefresh } from "../../provider/redux/slices/cartSlice";
import api from "../../utils/api";
import Header from "../../components/Header/Header";
import styles from "../../styles/RepeatOrderStyles";

export default function RepeatOrders() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repeatingOrder, setRepeatingOrder] = useState(null);

  const handleCardPress = (order) => {
    setSelectedOrder(order);
  };

  const handleBackPress = () => {
    setSelectedOrder(null);
  };

  const fetchOrders = async () => {
    try {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        navigation.navigate("(auth)/signin");
        return;
      }

      setLoading(true);
      const response = await api.get("/orders/user-orders", {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
        },
      });

      if (response.status === 200) {
        // Filter only completed/delivered orders for repeat functionality
        const completedOrders = response.data.data.filter(
          order => order.status === "Delivered" || order.status === "Completed"
        );
        setAllOrders(completedOrders);
      }
    } catch (error) {
      console.error("Network Error", error);
      Alert.alert(
        "Network Error",
        "Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRepeatOrder = async (orderId) => {
    try {
      setRepeatingOrder(orderId);
      
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        navigation.navigate("(auth)/signin");
        return;
      }

      const response = await api.post(`/orders/repeat-order/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
        },
      });

      if (response.status === 200) {
        const { addedItems, unavailableItems } = response.data.data;
        
        // Refresh cart in Redux
        dispatch(getCartOnRefresh());
        
        // Show success message with details
        let message = `${addedItems.length} items added to cart successfully!`;
        
        if (unavailableItems.length > 0) {
          message += `\n\n⚠️ ${unavailableItems.length} items were unavailable:\n`;
          unavailableItems.forEach(item => {
            message += `• ${item.name} (${item.reason})\n`;
          });
        }

        Alert.alert(
          "Order Repeated",
          message,
          [
            {
              text: "Continue Shopping",
              style: "cancel"
            },
            {
              text: "Go to Cart",
              onPress: () => router.push("/cart")
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error repeating order:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to repeat order. Please try again."
      );
    } finally {
      setRepeatingOrder(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigation]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
      case "Completed":
        return "#0AA759";
      case "Out for delivery":
        return "#ff8c00";
      case "Preparing":
        return "#ffa500";
      default:
        return "#666";
    }
  };

  return (
    <>
      <Header />
      <SafeAreaView style={styles.container}>
        {/* Back Arrow */}
        {selectedOrder ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )}

        {/* Header */}
        <Text style={styles.header}>
          {selectedOrder ? "Order Details" : "Repeat Previous Orders"}
        </Text>

        {/* Loading indicator */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0AA759" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : allOrders.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No previous orders found</Text>
            <Text style={styles.emptySubText}>
              Complete your first order to see it here
            </Text>
          </View>
        ) : selectedOrder ? (
          /* Order Detail View */
          <ScrollView contentContainerStyle={styles.orderDetails}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>
                Order #{selectedOrder.orderNo}
              </Text>
              <TouchableOpacity
                style={[styles.repeatButton, repeatingOrder === selectedOrder._id && styles.repeatButtonDisabled]}
                onPress={() => handleRepeatOrder(selectedOrder._id)}
                disabled={repeatingOrder === selectedOrder._id}
              >
                {repeatingOrder === selectedOrder._id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="refresh-outline" size={16} color="white" />
                    <Text style={styles.repeatButtonText}>Repeat Order</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.orderPIN}>
              Delivery PIN #{selectedOrder.deliveryPin}
            </Text>

            <Text style={styles.subHeading}>Items Ordered:</Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.item}>{item?.menu?.name || item.name}</Text>
                <Text style={styles.itemQuantity}>x {item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  ₹{(item?.menu?.price || item.price) * item.quantity}
                </Text>
              </View>
            ))}

            <View style={styles.priceBreakdown}>
              <Text style={styles.subHeading2}>Price Breakdown</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Items Total</Text>
                  <Text style={styles.tableText}>₹{selectedOrder.totalAmount}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Delivery Charge</Text>
                  <Text style={styles.tableText}>₹{selectedOrder.deliveryCharge || 0}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Packaging Charge</Text>
                  <Text style={styles.tableText}>₹{selectedOrder.packagingCharge || 0}</Text>
                </View>
                <View style={[styles.tableRow, styles.totalRow]}>
                  <Text style={styles.totalText}>Total Price</Text>
                  <Text style={styles.totalText}>
                    ₹{selectedOrder.totalAmount + selectedOrder.deliveryCharge + selectedOrder.packagingCharge}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.subHeading}>Order Date:</Text>
            <Text style={styles.item}>
              {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>

            <Text style={styles.subHeading}>Delivery Address:</Text>
            <Text style={styles.item}>
              {selectedOrder.deliveryAddress?.hostel?.name || "N/A"}
            </Text>
          </ScrollView>
        ) : (
          /* Orders List View */
          <ScrollView contentContainerStyle={styles.ordersList}>
            {allOrders.map((order) => (
              <View key={order._id} style={styles.repeatOrderCard}>
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => handleCardPress(order)}
                >
                  <Text style={styles.orderTitle}>Order #{order.orderNo}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                  <Text style={styles.item} numberOfLines={2}>
                    {order.items
                      .map(
                        (item) =>
                          `${item?.menu?.name || item.name} x ${item.quantity}`
                      )
                      .join(", ")}
                  </Text>
                  <View style={styles.orderInfo}>
                    <Text style={styles.price}>
                      ₹{order.totalAmount + order.packagingCharge + order.deliveryCharge}
                    </Text>
                    <Text
                      style={[
                        styles.status,
                        { color: getStatusColor(order.status) },
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.repeatButton, repeatingOrder === order._id && styles.repeatButtonDisabled]}
                  onPress={() => handleRepeatOrder(order._id)}
                  disabled={repeatingOrder === order._id}
                >
                  {repeatingOrder === order._id ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="refresh-outline" size={16} color="white" />
                      <Text style={styles.repeatButtonText}>Repeat</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <BottomTab />
      </SafeAreaView>
    </>
  );
}
