import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../../utils/const";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Save tokens securely
  const saveTokens = async (accessToken, refreshToken) => {
    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const savedAccessToken = localStorage.getItem("accessToken");
      const savedRefreshToken = localStorage.getItem("refreshToken");

      console.log(savedAccessToken);
      console.log(savedRefreshToken);
      return;
    } else {
      try {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        const savedAccessToken = await SecureStore.getItemAsync("accessToken");
        const savedRefreshToken = await SecureStore.getItemAsync(
          "refreshToken"
        );

        console.log(savedAccessToken);
        console.log(savedRefreshToken);
      } catch (err) {
        console.error("Error saving tokens:", err);
        Alert.alert("Error", "Failed to save authentication tokens.");
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill out both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        await saveTokens(accessToken, refreshToken);
        Alert.alert("Success", "Logged in successfully!");
        router.push("/"); // Navigate to the home route
      } else {
        Alert.alert("Login Failed", response.data.message || "Unknown error.");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/food.png")}
        style={styles.logo}
      />
      <Text style={styles.restaurantName}>Red Food Club</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* Forgot Password Link */}
      <Text style={styles.forgotPasswordText}>
        Forgot Password?{" "}
        <Link href="/otpLogin" style={styles.linkText}>
          Login with OTP
        </Link>
      </Text>

      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Link href="/signup" style={styles.linkText}>
          Sign Up
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#f25c05",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotPasswordText: {
    marginTop: 16,
    color: "#000000",
    textAlign: "center",
    fontSize: 14,
  },
  signupText: {
    marginTop: 16,
    color: "#000000",
    textAlign: "center",
    fontSize: 14,
  },
  linkText: {
    color: "#f25c05",
    fontWeight: "bold",
  },
});
