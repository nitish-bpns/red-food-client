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

const PlaceOrderButton = (orderNote) => {
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [currentMerchantTransactionId, setCurrentMerchantTransactionId] = useState(null);
  const [phonePeConfig, setPhonePeConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [statusCheckCount, setStatusCheckCount] = useState(0);
  const statusCheckTimerRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const selectedAddress = useSelector((state) => state.address.selectedAddress);
  const deliveryId = selectedAddress?._id;

  // Fetch PhonePe configuration on component mount
  useEffect(() => {
    fetchPhonePeConfig();
    
    // Cleanup timer on unmount
    return () => {
      if (statusCheckTimerRef.current) {
        clearTimeout(statusCheckTimerRef.current);
      }
    };
  }, []);

  const fetchPhonePeConfig = async () => {
    try {
      setConfigLoading(true);
      const yourAuthToken = await getAuthToken();
      
      if (!yourAuthToken) {
        console.error("No auth token available for config fetch");
        Alert.alert("Authentication Error", "Please sign in to continue.");
        return;
      }

      console.log("Fetching PhonePe configuration...");
      const response = await axios.get(
        `${BASE_URL}/order-and-payment/config`,
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setPhonePeConfig(response.data.config);
        console.log("✅ PhonePe config loaded:", response.data.config);
      } else {
        console.error("❌ Failed to fetch PhonePe config:", response.data.message);
        Alert.alert("Configuration Error", "Failed to load payment configuration.");
      }
    } catch (error) {
      console.error("❌ Error fetching PhonePe config:", error);
      Alert.alert("Configuration Error", "Failed to load payment configuration. Please try again.");
    } finally {
      setConfigLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    console.log("=== PLACE ORDER CLICKED ===");
    
    // Validate delivery address
    if (!deliveryId) {
      Alert.alert(
        "No Address Selected",
        "Please select a delivery address before placing your order."
      );
      return;
    }

    // Validate PhonePe configuration
    if (!phonePeConfig) {
      Alert.alert(
        "Configuration Error",
        "Payment configuration not loaded. Please try again.",
        [
          { text: "Retry", onPress: fetchPhonePeConfig },
          { text: "Cancel", style: "cancel" }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const yourAuthToken = await getAuthToken();

      if (!yourAuthToken) {
        Alert.alert("Authentication Error", "Please sign in again.");
        return;
      }

      console.log("Creating order with backend...");
      console.log("Using PhonePe config:", phonePeConfig);
      
      // Step 1: Create order with backend
      const response = await axios.post(
        `${BASE_URL}/order-and-payment/create`,
        { deliveryId: deliveryId, orderNote: orderNote },
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Order creation failed");
      }

      console.log("✅ Order created successfully");
      console.log("Order data:", response.data);

      // Step 2: Extract payment data from response
      const { payload, orderId, merchantTransactionId } = response.data;

      // Validate payment data
      if (!payload || !payload.token || !payload.orderId || !merchantTransactionId) {
        throw new Error("Invalid payment data received from server");
      }

      // Store order and transaction details
      setOrderId(orderId);
      setCurrentMerchantTransactionId(merchantTransactionId);
      setStatusCheckCount(0);

      console.log("Payment data received:", {
        phonePeOrderId: payload.orderId,
        merchantTransactionId,
        hasToken: !!payload.token
      });

      // Step 3: Initialize PhonePe SDK
      console.log("Initializing PhonePe SDK...");
      await PhonePePaymentSDK.init(
        phonePeConfig.environment,
        phonePeConfig.merchantId,
        phonePeConfig.flowId,
        true // Enable logging for debugging
      );
      console.log("✅ PhonePe SDK initialized successfully");

      // Step 4: Start payment transaction
      console.log("Starting PhonePe payment transaction...");
      const result = await PhonePePaymentSDK.startTransaction(
        JSON.stringify(payload),
        phonePeConfig.appSchema
      );
      
      console.log("Payment transaction result:", result);

      // Step 5: Handle payment result and start automatic verification
      handlePaymentResult(result, merchantTransactionId);

    } catch (error) {
      console.error("❌ Payment Error:", error);
      handlePaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentResult = (result, merchantTransactionId) => {
    console.log("=== HANDLING PAYMENT RESULT ===");
    console.log("Payment result:", result);

    // Regardless of the result, start automatic verification
    // This ensures we check the actual payment status from PhonePe
    startAutomaticPaymentVerification(merchantTransactionId);

    // Show appropriate message based on SDK result
    if (result?.status === "SUCCESS") {
      console.log("✅ PhonePe SDK returned SUCCESS");
      // Don't show success alert yet - wait for verification
    } else if (result?.status === "FAILED") {
      console.log("❌ PhonePe SDK returned FAILED");
      Alert.alert(
        "Payment Failed",
        "The payment was not successful. We'll verify the status automatically."
      );
    } else if (result?.status === "INTERRUPTED") {
      console.log("⚠️ PhonePe SDK returned INTERRUPTED");
      Alert.alert(
        "Payment Interrupted",
        "The payment was interrupted. We'll verify the status automatically."
      );
    } else {
      console.log("⏳ PhonePe SDK returned unknown status, starting verification");
    }
  };

  const handlePaymentError = (error) => {
    if (error.response) {
      // Server error
      const errorMessage = error.response.data?.message || "Server error occurred";
      console.error("Server Error:", error.response.data);
      Alert.alert("Server Error", errorMessage);
    } else if (error.request) {
      // Network error
      console.error("Network Error:", error.request);
      Alert.alert(
        "Network Error",
        "Please check your internet connection and try again."
      );
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error("Timeout Error:", error.message);
      Alert.alert(
        "Timeout Error",
        "The request took too long. Please try again."
      );
    } else {
      // Other error
      console.error("Payment Error:", error.message);
      Alert.alert(
        "Payment Error",
        error.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  const startAutomaticPaymentVerification = (merchantTransactionId) => {
    console.log("=== STARTING AUTOMATIC PAYMENT VERIFICATION ===");
    console.log("Transaction ID:", merchantTransactionId);
    
    setIsProcessingPayment(true);
    setStatusCheckCount(0);
    checkPaymentStatus(merchantTransactionId, 0, 3000); // Start with 3 second interval
  };

  const checkPaymentStatus = async (merchantTransactionId, attempts = 0, interval = 3000) => {
    console.log(`=== CHECKING PAYMENT STATUS (Attempt ${attempts + 1}) ===`);

    if (!merchantTransactionId) {
      console.error("❌ Missing merchantTransactionId");
      setIsProcessingPayment(false);
      Alert.alert("Error", "Missing transaction ID for verification");
      return;
    }

    // Maximum attempts: 20 attempts at 3s + 20 attempts at 5s + 20 attempts at 10s = 6 minutes total
    const maxAttempts = 60;
    setStatusCheckCount(attempts + 1);

    try {
      const yourAuthToken = await getAuthToken();

      if (!yourAuthToken) {
        console.error("❌ Missing auth token for status check");
        setIsProcessingPayment(false);
        Alert.alert("Authentication Error", "Please sign in again.");
        return;
      }

      // Check payment status with backend (which calls PhonePe Order Status API)
      const response = await fetch(`${BASE_URL}/order-and-payment/check-status`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantTransactionId: merchantTransactionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment status response:", data);

      if (data.success && data.paymentStatus) {
        const status = data.paymentStatus.toLowerCase();
        console.log("Payment status:", status);

        // Handle successful payment
        if (status === "success") {
          console.log("🎉 PAYMENT SUCCESSFUL!");
          setIsProcessingPayment(false);
          dispatch(getCartOnRefresh()); // Refresh cart (should be empty now)
          
          Alert.alert(
            "Order Placed Successfully! 🎉",
            "Your payment has been confirmed and order is being processed.",
            [
              {
                text: "View My Orders",
                onPress: () => navigation.navigate("(profile)/orders")
              }
            ]
          );
          return;
        }

        // Handle failed payment
        if (["failed", "error", "declined", "cancelled"].includes(status)) {
          console.log("❌ PAYMENT FAILED:", status);
          setIsProcessingPayment(false);
          Alert.alert(
            "Payment Failed",
            `Payment ${status}. Please try placing your order again.`,
            [{ text: "OK" }]
          );
          return;
        }

        // If status is still "payment_initiated", continue checking
        if (status === "payment_initiated") {
          console.log("⏳ Payment still being processed, continuing verification...");
        }
      }

      // Continue checking if we haven't reached max attempts
      if (attempts < maxAttempts) {
        // Progressive interval: 3s for first 20, 5s for next 20, 10s for final 20
        let nextInterval = 3000;
        if (attempts >= 40) nextInterval = 10000;
        else if (attempts >= 20) nextInterval = 5000;
        
        console.log(`⏳ Scheduling next check in ${nextInterval}ms...`);
        statusCheckTimerRef.current = setTimeout(() => {
          checkPaymentStatus(merchantTransactionId, attempts + 1, nextInterval);
        }, nextInterval);
      } else {
        // Max attempts reached
        console.log("⏰ Max verification attempts reached");
        setIsProcessingPayment(false);
        Alert.alert(
          "Verification Timeout",
          "Payment verification is taking longer than expected. Please check your orders or contact support if payment was deducted.",
          [
            {
              text: "Check Orders",
              onPress: () => navigation.navigate("(profile)/orders")
            },
            { text: "OK", style: "cancel" }
          ]
        );
      }
    } catch (error) {
      console.error("❌ Error checking payment status:", error);
      setIsProcessingPayment(false);
      
      // Enhanced error handling for status check
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        Alert.alert(
          "Network Error",
          "Unable to verify payment status. Please check your internet connection."
        );
      } else {
        Alert.alert(
          "Verification Error",
          "Failed to verify payment status. Please check your orders section or contact support if payment was deducted."
        );
      }
    }
  };

  const cancelPaymentVerification = () => {
    console.log("=== CANCELLING PAYMENT VERIFICATION ===");
    if (statusCheckTimerRef.current) {
      clearTimeout(statusCheckTimerRef.current);
    }
    setIsProcessingPayment(false);
    setStatusCheckCount(0);
    
    Alert.alert(
      "Verification Cancelled",
      "Payment verification has been cancelled. You can check your order status in the orders section.",
      [
        {
          text: "Check Orders",
          onPress: () => navigation.navigate("(profile)/orders")
        },
        { text: "OK", style: "cancel" }
      ]
    );
  };

  const getButtonText = () => {
    if (configLoading) return "Loading Configuration...";
    if (loading) return "Processing Order...";
    if (isProcessingPayment) return "Verifying Payment...";
    if (!phonePeConfig) return "Configuration Error";
    return "Place My Order";
  };

  const isButtonDisabled = () => {
    return configLoading || loading || isProcessingPayment || !phonePeConfig;
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          isButtonDisabled() && styles.placeOrderButtonDisabled
        ]}
        onPress={handlePlaceOrder}
        disabled={isButtonDisabled()}
      >
        <Text style={styles.placeOrderText}>
          {getButtonText()}
        </Text>
      </TouchableOpacity>

      {/* Payment Verification Modal */}
      <Modal
        transparent={true}
        visible={isProcessingPayment}
        animationType="fade"
        onRequestClose={cancelPaymentVerification}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.processingText}>Verifying Payment...</Text>
            <Text style={styles.processingSubText}>
              Please wait while we confirm your payment with PhonePe
            </Text>
            <Text style={styles.attemptText}>
              Verification attempt: {statusCheckCount} / 60
            </Text>
            {currentMerchantTransactionId && (
              <Text style={styles.transactionIdText}>
                Transaction: {currentMerchantTransactionId}
              </Text>
            )}
            <Text style={styles.warningText}>
              Please don't close this screen during verification
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelPaymentVerification}
            >
              <Text style={styles.cancelButtonText}>Cancel Verification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PlaceOrderButton;