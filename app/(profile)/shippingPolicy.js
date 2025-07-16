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

export default function ShippingPolicy() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Shipping Policy</Text>
        <Text style={styles.sectionTitle}>
          Effective Date: 19th May, 2025
        </Text>

        <Text style={styles.sectionTitle}>1. Order Processing</Text>
        <Text style={styles.text}>
          Once an order has been placed and processed, it is shipped via our in-house delivery partners or third-party logistic providers. Orders are prepared and dispatched as soon as possible to ensure quick delivery.
        </Text>

        <Text style={styles.sectionTitle}>2. Delivery Timeline</Text>
        <Text style={styles.text}>
          All orders are tentatively delivered within 60 minutes after being dispatched. However, unforeseen circumstances such as weather conditions, traffic, or operational challenges may impact the delivery times. We strive to minimize any delays and ensure that your order reaches you as soon as possible.
          {"\n"}Once the order is shipped, it will be delivered within 2-3 hours.
        </Text>

        <Text style={styles.sectionTitle}>3. Tracking Your Order</Text>
        <Text style={styles.text}>
          Once your order is dispatched, you will receive an SMS notification with a tracking link. You can use this link to monitor the progress of your delivery and contact the delivery agent if necessary.
        </Text>

        <Text style={styles.sectionTitle}>4. Delivery Locations</Text>
        <Text style={styles.text}>
          Currently, we offer delivery services within the IIT Kharagpur campus and nearby locations. If your location is not covered, you will be notified at the time of checkout.
        </Text>

        <Text style={styles.sectionTitle}>5. Delivery Charges</Text>
        <Text style={styles.text}>
          Delivery charges may vary depending on your location and the total order value. Any applicable delivery fees will be displayed at checkout before order confirmation.
        </Text>

        <Text style={styles.sectionTitle}>6. Order Issues</Text>
        <Text style={styles.text}>
          If you experience any issues with your order, such as delays, missing items, or incorrect deliveries, please contact our support team immediately for assistance.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.text}>
          For any queries regarding shipping and delivery, reach out to us:
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
