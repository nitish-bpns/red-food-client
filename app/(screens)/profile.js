import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { getAuthToken } from "../../utils/auth";
import axios from "axios";
import { BASE_URL } from "../../utils/const";
import * as SecureStore from "expo-secure-store";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header/Header";
import styles from "../../styles/ProfileStyles";

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  const fetchUserProfile = async () => {
    try {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        navigation.navigate("(auth)/signin");
        return;
      }

      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
        },
      });
      setUserProfile(response?.data?.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // This will run when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // This will run whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      return () => {}; // cleanup function
    }, [])
  );

  const handleLogout = async () => {
    try {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        throw new Error("No auth token found");
      }

      const response = await axios.post(
        `${BASE_URL}/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${yourAuthToken}`,
          },
        }
      );

      if (response.status === 200) {
        try {
          if (Platform.OS === "web") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          } else {
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
          }
          Alert.alert("Success", "Logged out successfully!");
          router.push("/signin");
        } catch (tokenError) {
          console.error("Error clearing tokens:", tokenError);
          Alert.alert("Error", "Failed to clear authentication tokens.");
        }
      } else {
        console.log("Logout failed with status:", response.status);
        Alert.alert(
          "Logout Failed",
          response.data.message || "An error occurred while logging out."
        );
      }
    } catch (err) {
      console.error("Logout Error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{userProfile.username}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
          <Link
            href={{
              pathname: "/editProfile",
              params: {
                userProfile: JSON.stringify(userProfile), // Serialize the object
              },
            }}
            style={styles.editIcon}
          >
            <Text style={styles.editText}>Edit</Text>
          </Link>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Link href="/orders" style={styles.settingItem}>
            <Text style={styles.settingText}>My Orders</Text>
          </Link>
          <Link href="/privacyPolicy" style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Policy</Text>
          </Link>
          <Link href="/termsConditions" style={styles.settingItem}>
            <Text style={styles.settingText}>Term & Condition</Text>
          </Link>
          <Link href="/support" style={styles.settingItem}>
            <Text style={styles.settingText}>Support</Text>
          </Link>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
