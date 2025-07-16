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

export default function AboutUs() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>About Us</Text>

        <Text style={styles.text}>
          Welcome to <Text style={{fontWeight: 'bold'}}>Red Food Club</Text> – a
          multi-brand, multi-cuisine cloud kitchen dedicated to serving
          high-quality and delicious food. With expertise spanning across{" "}
          <Text style={{fontWeight: 'bold'}}>
            Indian, Chinese, Tandoori, and Continental
          </Text>{" "}
          cuisines, we bring a wide range of flavors straight to your plate.
        </Text>

        <Text style={styles.sectionTitle}>Our Commitment</Text>
        <Text style={styles.text}>
          At Red Food Club, we are passionate about delivering an
          unforgettable culinary experience. With years of expertise in the
          food industry, our chefs craft each dish with precision, ensuring
          that every bite is a burst of flavor. Quality and customer
          satisfaction are at the heart of everything we do.
        </Text>

        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <Text style={styles.text}>
          {"\n"}- A diverse menu featuring Indian, Chinese, Tandoori, and
          Continental cuisines.
          {"\n"}- Prepared with fresh ingredients and authentic recipes by expert
          chefs.
          {"\n"}- Fast and hygienic food preparation with a focus on quality.
          {"\n"}- Reliable delivery services to bring food straight to your door.
        </Text>

        <Text style={styles.sectionTitle}>Our Location</Text>
        <Text style={styles.text}>
          We are based in IIT Kharagpur, serving delicious meals to students,
          faculty, and food lovers in the region.
          {"\n\n"}<Text style={{fontWeight: 'bold'}}>Address:</Text> Red Food Club, IIT
          Kharagpur, Kharagpur, West Bengal, PIN 721302
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.text}>
          Have a question or feedback? Feel free to reach out to us:
          {"\n"}- Email: support@redfoodclub.com
          {"\n"}- Phone: +91 7213526485
          {"\n"}- Business Name: Raja niraj Manuel
          {"\n"}- Address: Red Food Club, IIT Kharagpur, West Bengal, PIN 721302
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
