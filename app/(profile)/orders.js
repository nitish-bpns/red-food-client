import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import BottomTab from "../../components/BottomTab";
import { Ionicons } from "@expo/vector-icons"; // For back arrow icon
import { getAuthToken } from "../../utils/auth";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/OrderStyles";
import api from "../../utils/api"; // Add this import for the API client
import Header from "../../components/Header/Header";

export default function AllOrders() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false); // Added missing loading state

  const navigation = useNavigation();

  const handleCardPress = (order) => {
    setSelectedOrder(order);
  };

  const handleBackPress = () => {
    setSelectedOrder(null);
  };

  // Function to fetch orders data
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
        setAllOrders(response.data.data);
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

  useEffect(() => {
    fetchOrders();
  }, [navigation]);

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
          {selectedOrder ? "Order Details" : "My Orders"}
        </Text>

        {/* Loading indicator or empty state could be added here */}
        {loading ? (
          <View style={styles.centered}>
            <Text>Loading orders...</Text>
          </View>
        ) : allOrders.length === 0 ? (
          <View style={styles.centered}>
            <Text>No orders found</Text>
          </View>
        ) : /* Orders List or Order Detail */
        selectedOrder ? (
          <ScrollView contentContainerStyle={styles.orderDetails}>
            <Text style={styles.orderTitle}>
              Order #{selectedOrder.orderNo}
            </Text>

            <Text style={styles.orderTitle}>
              Delivery PIN #{selectedOrder.deliveryPin}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (selectedOrder?.deliveryAgentContact) {
                  Linking.openURL(`tel:${selectedOrder.deliveryAgentContact}`);
                } else {
                  alert("Phone number not available");
                }
              }}
            >
              <Text style={styles.orderPIN}>
                Delivery Agent:{" "}
                {selectedOrder?.deliveryAgentName || "Not found"}
                {", Ph.- "}
                {selectedOrder?.deliveryAgentContact || "Not found"}
              </Text>
            </TouchableOpacity>
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
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Description</Text>
                  <Text style={styles.tableHeaderText}>Amount</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Items Total</Text>
                  <Text style={styles.tableText}>
                    ₹{selectedOrder.totalAmount}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Delivery Charge</Text>
                  <Text style={styles.tableText}>
                    ₹{selectedOrder.deliveryCharge || 0}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Packaging Charge</Text>
                  <Text style={styles.tableText}>
                    ₹{selectedOrder.packagingCharge || 0}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableText}>Total Price</Text>
                  <Text style={styles.tableText}>
                    ₹
                    {selectedOrder.totalAmount +
                      selectedOrder.deliveryCharge +
                      selectedOrder.packagingCharge}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.subHeading}>Delivery Address:</Text>
            <Text style={styles.item}>
              {selectedOrder.deliveryAddress?.hostel?.name || "N/A"}
            </Text>

            <Text style={styles.subHeading}>Contact Number:</Text>
            <Text style={styles.item}>
              {selectedOrder.deliveryAddress?.contactNumber || "N/A"}
            </Text>

            <Text style={styles.subHeading}>Order Status:</Text>
            <Text
              style={[
                styles.item,
                { color: getStatusColor(selectedOrder.status) },
              ]}
            >
              {selectedOrder.status === "Pending"
                ? "Payment Failed"
                : selectedOrder.status}
            </Text>

            <Text style={styles.subHeading}>Note:</Text>
            <Text style={styles.item}>
              {selectedOrder.orderNote || "No notes"}
            </Text>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.ordersList}>
            {allOrders.map((order) => (
              <TouchableOpacity
                key={order._id}
                style={styles.card}
                onPress={() => handleCardPress(order)}
              >
                <Text style={styles.orderTitle}>Order #{order.orderNo}</Text>
                <Text style={styles.orderPIN}>
                  Delivery PIN #{order.deliveryPin}
                </Text>
                <Text style={styles.item}>
                  {order.items
                    .map(
                      (item) =>
                        `${item?.menu?.name || item.name} x ${item.quantity}`
                    )
                    .join(", ")}
                </Text>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.price}>
                    ₹
                    {order.totalAmount +
                      order.packagingCharge +
                      order.deliveryCharge}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {order.status === "Pending"
                      ? "Payment Failed"
                      : order.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Bottom Tab */}
        <BottomTab />
      </SafeAreaView>
    </>
  );
}

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "red";
    case "New":
      return "green";
    case "PAYMENT_ERROR":
      return "red";
    case "PAYMENT_DECLINED":
      return "red";
    case "PAYMENT_CANCELLED":
      return "red";
    case "Preparing":
      return "lightGreen";
    case "Out for delivery":
      return "green";
    case "Delivered":
      return "blue";
    default:
      return "black";
  }
};
