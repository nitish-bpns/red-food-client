import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getAuthToken } from "../../utils/auth";
import { BASE_URL } from "../../utils/const";
import PhonePePaymentSDK from "react-native-phonepe-pg";
import styles from "../../styles/CartStyles";
import { useNavigation } from "@react-navigation/native";
import { getCartOnRefresh } from "../../provider/redux/slices/cartSlice";

if (!PhonePePaymentSDK) {
  console.error("PhonePe SDK is not linked properly");
}

const MERCHANT_ID = "PGTESTPAYUAT86";
const ENVIRONMENT = "SANDBOX";
const callback = "https://webhook.site/a4666fa0-6cb9-45c9-987d-1be4ef026cbb";

const PlaceOrderButton = (orderNote) => {
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [currentMerchantTransactionId, setCurrentMerchantTransactionId] =
    useState(null);
  const statusCheckTimerRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const selectedAddress = useSelector((state) => state.address.selectedAddress);
  const deliveryId = selectedAddress?._id;

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (statusCheckTimerRef.current) {
        clearTimeout(statusCheckTimerRef.current);
      }
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (!deliveryId) {
      Alert.alert(
        "No Address Selected",
        "Please select a delivery address first."
      );
      return;
    }

    try {
      setLoading(true);
      const yourAuthToken = await getAuthToken();

      if (!yourAuthToken) {
        Alert.alert("Authentication Error", "Please sign in again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/orders/create`,
        { deliveryId: deliveryId, orderNote: orderNote },
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const payload = response.data.payload;
      const checksum = response.data.checksum;
      const createdOrderId = response.data.orderId;
      const merchantTransactionId = response.data.merchantTransactionId;

      setOrderId(createdOrderId);
      setCurrentMerchantTransactionId(merchantTransactionId);

      console.log("Initializing payment...");
      await PhonePePaymentSDK.init(ENVIRONMENT, MERCHANT_ID, "321", true);
      console.log("SDK Initialized");

      const result = await PhonePePaymentSDK.startTransaction(
        payload,
        checksum,
        null,
        null
      );
      console.log("Payment Result:", result);

      if (result?.status === "SUCCESS") {
        startPaymentStatusCheck(merchantTransactionId);
      } else if (result?.status === "FAILED") {
        Alert.alert("Payment Failed", "The transaction was not successful.");
      } else {
        Alert.alert("Payment Pending", "The payment is being processed.");
        startPaymentStatusCheck(merchantTransactionId);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "An error occurred while processing your order.");
    } finally {
      setLoading(false);
    }
  };

  const startPaymentStatusCheck = (merchantTransactionId) => {
    setIsProcessingPayment(true);
    checkPaymentStatus(merchantTransactionId, 0, 5000);
  };

  const checkPaymentStatus = async (
    merchantTransactionId,
    attempts = 0,
    interval = 5000
  ) => {
    console.log(`Checking payment status (attempt ${attempts + 1})`);

    if (!merchantTransactionId) {
      console.error("Missing merchantTransactionId");
      setIsProcessingPayment(false);
      return;
    }

    const maxAttempts = 42; // 24 + 18

    try {
      const yourAuthToken = await getAuthToken();

      if (!yourAuthToken) {
        console.error("Missing auth token");
        setIsProcessingPayment(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/payments/checkPaymentStatus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantTransactionId: merchantTransactionId,
        }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (data?.paymentStatus) {
        console.log("Payment Status: ", data.paymentStatus);

        if (data.paymentStatus === "success") {
          setIsProcessingPayment(false);
          dispatch(getCartOnRefresh());
          Alert.alert(
            "Order Placed Successfully",
            "Your order has been placed."
          );
          navigation.navigate("(profile)/orders");
          return;
        } else if (data.paymentStatus === "FAILED") {
          setIsProcessingPayment(false);
          Alert.alert("Payment Failed", "Please try again.");
          return;
        }
      }

      // Continue checking if we haven't reached max attempts
      if (attempts < maxAttempts) {
        // Adjust interval after 24 attempts
        const nextInterval = attempts >= 23 ? 10000 : interval;
        statusCheckTimerRef.current = setTimeout(() => {
          checkPaymentStatus(merchantTransactionId, attempts + 1, nextInterval);
        }, nextInterval);
      } else {
        setIsProcessingPayment(false);
        Alert.alert("Payment Timeout", "Payment verification took too long.");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setIsProcessingPayment(false);
      Alert.alert("Error", "Failed to verify payment status.");
    }
  };

  const cancelPaymentCheck = () => {
    if (statusCheckTimerRef.current) {
      clearTimeout(statusCheckTimerRef.current);
    }
    setIsProcessingPayment(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        disabled={loading || isProcessingPayment}
      >
        <Text style={styles.placeOrderText}>
          {loading
            ? "Processing..."
            : isProcessingPayment
            ? "Verifying Payment..."
            : "Place My Order"}
        </Text>
      </TouchableOpacity>

      {/* Fullscreen Modal for Payment Processing */}
      <Modal
        transparent={true}
        visible={isProcessingPayment}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.processingText}>Processing Payment...</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelPaymentCheck}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default PlaceOrderButton;
