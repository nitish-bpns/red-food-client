import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refreshToken } from "@/provider/redux/slices/authSlice";
// import store from "../provider/redux/store";
import { BASE_URL } from "./const";
import { Platform } from "react-native";

// Function to retrieve the token from SecureStore
const getAccessToken = async () => {
    if (Platform.OS === "web") {
        return localStorage.getItem("accessToken");
    }
    else {
        try {
            const token = await SecureStore.getItemAsync("accessToken");
            return token;
        } catch (err) {
            console.error("Error retrieving access token:", err);
            return null;
        }
    }
};

// Create axios instance
const api = axios.create({
    // Update baseURL as per your environment
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach Authorization header dynamically
api.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration and retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            // Refresh token logic
            try {
                // await store.dispatch(refreshToken()); // Dispatch the Redux action to refresh the token
                const newAccessToken = store.getState().auth.accessToken; // Get updated access token from the store

                if (newAccessToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return api(originalRequest); // Retry the original request
                }
            } catch (err) {
                console.error("Failed to refresh token:", err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
