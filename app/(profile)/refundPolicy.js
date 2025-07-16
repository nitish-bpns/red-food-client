import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For back arrow icon
import { useRouter } from "expo-router";

export default function RefundPolicy() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Refund Policy</Text>
        <Text style={styles.sectionTitle}>
          Effective Date: 20th February, 2025
        </Text>

        <Text style={styles.sectionTitle}>1. Order Cancellations</Text>
        <Text style={styles.text}>
          Once an order has been placed, you can cancel it within 5 minutes. If canceled within this timeframe, the full amount will be credited to the original payment method within 3-4 working days.
        </Text>

        <Text style={styles.sectionTitle}>2. No Cancellation After 5 Minutes</Text>
        <Text style={styles.text}>
          After 5 minutes, cancellations will not be accepted, and no refunds will be provided. This is because the order is already being processed and prepared for delivery.
        </Text>

        <Text style={styles.sectionTitle}>3. No Return and Replacement Policy</Text>
        <Text style={styles.text}>
          Due to the nature of our food services, we do not accept any returns. Once the refund process is initiated, it will be credited in bank account within 5-7 working days. If there is an issue with your order, please reach out to our support team.
        </Text>

        <Text style={styles.sectionTitle}>4. Refund Processing</Text>
        <Text style={styles.text}>
          If a refund is approved, the amount will be credited back to the original payment method within 3-4 working days. The actual time may vary depending on your bank or payment provider.
        </Text>

        <Text style={styles.sectionTitle}>5. Refund Eligibility</Text>
        <Text style={styles.text}>
          Refunds are only applicable in the following cases:
          {"\n"}- If you cancel your order within the 5-minute cancellation window.
          {"\n"}- If your order was charged but not processed due to a system failure.
          {"\n"}- If your order was not delivered due to unforeseen circumstances.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Us</Text>
        <Text style={styles.text}>
          If you have any concerns regarding cancellations or refunds, please contact us:
          {"\n"}- Email: support@redfoodclub.com
          {"\n"}- Address: Red Food Club, IIT Kharagpur, Kharagpur, West Bengal, PIN 721302
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollView: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
});
