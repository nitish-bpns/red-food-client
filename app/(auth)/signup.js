import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../../utils/const";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    // Validate input fields
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // POST request to the backend
      const response = await axios.post(`${BASE_URL}/users/register`, {
        username: name, // Corrected input format
        email,
        password,
      });

      // Handle success response
      if (response.status === 201 && response.data.success) {
        Alert.alert("Success", "Account created successfully!");
        router.push("/signin"); // Navigate to the sign-in page
      } else {
        Alert.alert(
          "Registration Failed",
          response.data.message || "Unknown error."
        );
      }
    } catch (err) {
      // Handle error response
      console.error("SignUp Error:", err);
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
        source={require("../../assets/images/food.png")} // Ensure the path is correct
        style={styles.logo}
      />
      <Text style={styles.restaurantName}>Red Food Club</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>
        Already have an account?{" "}
        <Link href="/signin" style={styles.linkText}>
          Sign In
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
