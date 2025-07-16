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

export default function PrivacyPolicy() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Privacy Policy</Text>
        <Text style={styles.sectionTitle}>
          Effective Date: 20th January, 2025
        </Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our platform. By accessing or using
          our services, you agree to the terms of this policy.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We collect the following types of information:
          {"\n"}- Personal information (e.g., name, email, address, phone
          number).
          {"\n"}- Usage data (e.g., IP address, browser type, device
          information).
          {"\n"}- Payment information for transactions (if applicable).
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use your information to:
          {"\n"}- Provide and improve our services.
          {"\n"}- Communicate with you, including sending updates, offers, or
          promotional content.
          {"\n"}- Process payments and fulfill transactions.
          {"\n"}- Ensure security and prevent fraud.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          We may share your personal information with:
          {"\n"}- Service providers who help with our operations (e.g., payment
          processors, hosting services).
          {"\n"}- Legal authorities, if required by law or to protect our
          rights.
          {"\n"}- Third parties in the event of a merger or acquisition.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Retention</Text>
        <Text style={styles.text}>
          We retain your personal data for as long as necessary to fulfill the
          purposes outlined in this policy or as required by law.
        </Text>

        <Text style={styles.sectionTitle}>6. Cookies</Text>
        <Text style={styles.text}>
          We use cookies to enhance your experience on our platform. Cookies
          help us:
          {"\n"}- Remember your preferences and settings.
          {"\n"}- Analyze site traffic and usage patterns.
          {"\n"}- Provide personalized content.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {"\n"}- Access and update your personal information.
          {"\n"}- Request the deletion of your personal data, subject to certain
          conditions.
          {"\n"}- Opt out of marketing communications.
        </Text>

        <Text style={styles.sectionTitle}>8. Security</Text>
        <Text style={styles.text}>
          We take reasonable measures to protect your information from
          unauthorized access, use, or disclosure. However, no data transmission
          over the internet can be guaranteed to be completely secure.
        </Text>

        <Text style={styles.sectionTitle}>9. Third-Party Links</Text>
        <Text style={styles.text}>
          Our platform may contain links to third-party websites. We are not
          responsible for the privacy practices of these external sites. We
          encourage you to review their privacy policies.
        </Text>

        <Text style={styles.sectionTitle}>10. Children's Privacy</Text>
        <Text style={styles.text}>
          Our services are not intended for children under the age of 13. We do
          not knowingly collect or solicit personal information from children.
        </Text>

        <Text style={styles.sectionTitle}>
          11. Changes to This Privacy Policy
        </Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated "Effective Date."
        </Text>

        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions or concerns about our privacy practices, you
          can contact us at:
          {"\n"}- Email: support@redfoodclub.com
          {"\n"}- Business Name: Raja niraj Manuel
          {"\n"}- Address:IIT Kharagpur, Kharagpur, West
          Bengal
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
