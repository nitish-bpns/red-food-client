import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../../utils/const";
import * as SecureStore from "expo-secure-store";
import Header from "../../components/Header/Header";

export default function EditProfile() {
  const { userProfile } = useLocalSearchParams();
  const userDetail = JSON.parse(userProfile);

  const [username, setUsername] = useState(userDetail.username);
  const [email, setEmail] = useState(userDetail.email);
  // const [mobileNumber, setMobileNumber] = useState(userDetail.mobileNumber);
  const [password, setPassword] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const router = useRouter();

  const getAuthToken = async () => {
    return Platform.OS === "web"
      ? localStorage.getItem("accessToken")
      : await SecureStore.getItemAsync("accessToken");
  };

  const handleUpdateProfile = async () => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) throw new Error("No auth token found");

      const response = await axios.patch(
        `${BASE_URL}/users/profile`,
        { username, email, password },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        router.push("/profile");
      } else {
        Alert.alert("Update Failed", response.data.message || "Unknown error.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  useEffect(() => {
    setIsChanged(
      username !== userDetail.username ||
        email !== userDetail.email ||
        // mobileNumber !== userDetail.mobileNumber ||
        password !== ""
    );
  }, [username, email, password]);

  return (
    <>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {/* <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      /> */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          onPress={handleUpdateProfile}
          style={[
            styles.button,
            { backgroundColor: isChanged ? "#E23744" : "#CCCCCC" },
          ]}
          disabled={!isChanged}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAF9FB",
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
    marginTop: 40,
  },
  input: {
    height: 50,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#F7F7F7",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
