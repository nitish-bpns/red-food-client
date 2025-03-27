import React, { useState, useEffect } from "react";
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
import { OtpInput } from "react-native-otp-entry";
import axios from "axios";
import styles from "../../styles/LoginOtpStyle";
import { BASE_URL } from "../../utils/const";
import * as SecureStore from "expo-secure-store";

export default function OtpLoginScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  const saveTokens = async (accessToken, refreshToken) => {
    if (Platform.OS === "web") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log(localStorage.getItem("accessToken"));
      console.log(localStorage.getItem("refreshToken"));
      return;
    } else {
      try {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        console.log(await SecureStore.getItemAsync("accessToken"));
        console.log(await SecureStore.getItemAsync("refreshToken"));
      } catch (err) {
        console.error("Error saving tokens:", err);
        Alert.alert("Error", "Failed to save authentication tokens.");
      }
    }
  };

  useEffect(() => {
    setIsButtonDisabled(!email);
  }, [email]);

  const handleGenerateOtp = async () => {
    try {
      await axios.post(`${BASE_URL}/users/request-otp`, { email });
      Alert.alert("Success", "OTP sent successfully");
      setIsOtpSent(true);
      setTimer(15);
      setIsButtonDisabled(true);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0 && isOtpSent) {
      setIsButtonDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      Alert.alert("Error", "Please fill OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users/verify-otp`, {
        email,
        otp,
      });

      if (response.status === 200 && response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        await saveTokens(accessToken, refreshToken);
        Alert.alert("Success", "Logged in successfully!");
        setOtp("");
        router.push("/");
      } else {
        Alert.alert("Login Failed", response.data.message || "Unknown error.");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
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
      <Text style={styles.heading}>Login with OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleGenerateOtp}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>
          {timer > 0 ? `Resend OTP in ${timer}s` : "Generate OTP"}
        </Text>
      </TouchableOpacity>

      {!isOtpSent && (
        <View>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Link href="/signup" style={styles.linkText}>
              Sign Up
            </Link>
          </Text>
        </View>
      )}

      {isOtpSent && (
        <View style={styles.otpSection}>
          <Text style={styles.inputLabel}>Enter OTP sent to your email</Text>
          <OtpInput
            numberOfDigits={6}
            focusColor="green"
            onTextChange={(text) => setOtp(text)}
            theme={{ containerStyle: styles.otpContainer }}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
