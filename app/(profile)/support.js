import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For back arrow icon
import { useRouter } from "expo-router";

export default function Support() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Support</Text>

      {/* Contact Information */}
      <View style={styles.card}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>support@example.com</Text>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.text}>+91 95078 16000</Text>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <Text style={styles.title}>Our Address</Text>
        <Text style={styles.text}>IIT Kharagpur, Kharagpur, West Bengal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9FB",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 40, // Ensures space for back arrow
    color: "black",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 4, // Accent for card
    borderLeftColor: "#E23744",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#E23744",
  },
  label: {
    fontSize: 16,
    color: "#555555",
    marginTop: 8,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#000000",
    marginTop: 4,
  },
});
