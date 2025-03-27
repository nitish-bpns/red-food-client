import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_KEY = "accessToken";

// Store Auth Token
export const storeAuthToken = async (token) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Error storing auth token:", error);
  }
};

// Get Auth Token
export const getAuthToken = async () => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem("accessToken");
    } else {
      return await SecureStore.getItemAsync("accessToken");
    }
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

// Remove Auth Token (For Logout)
export const removeAuthToken = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error removing auth token:", error);
  }
};
