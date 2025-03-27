import messaging from "@react-native-firebase/messaging";
import { Platform, Alert, Linking } from "react-native";
import axios from "axios";
import { BASE_URL } from "@/utils/const";
import { getAuthToken } from "@/utils/auth";

export const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    try {
      await messaging().android.createChannel({
        id: "default-channel",
        name: "Default Channel",
        description: "Default notification channel",
        importance: 4,
        sound: "default",
        vibration: true,
      });
      console.log("Notification channel created successfully");
    } catch (error) {
      console.error("Failed to create notification channel:", error);
    }
  }
};

export const requestNotificationPermission = async () => {
  try {
    await createNotificationChannel();

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await messaging().requestPermission({
        sound: true,
        alert: true,
        badge: true,
        provisional: false,
      });
    }

    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log("Notification permission granted");
      return true;
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log("Provisional notification permission granted");
      return true;
    } else {
      console.log("Notification permission denied");
      Alert.alert(
        "Notification Permissions",
        "Notifications are disabled. You can enable them in device settings.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return false;
    }
  } catch (error) {
    console.error("Notification permission error:", error);
    return false;
  }
};

export const getFCMTokenAndStore = async (token = null, isRefresh = false) => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("No notification permission, skipping token retrieval");
      return null;
    }

    const fcmToken = token || await messaging().getToken();
    console.log("FCM Token obtained:", fcmToken);

    const isAuth = await getAuthToken();
    if (isAuth) {
      await sendTokenToBackend(fcmToken);
    } else {
      console.log("User not authenticated, skipping token registration with backend");
    }

    return fcmToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

const sendTokenToBackend = async (token) => {
  if (!token) {
    console.log("No token to send to backend");
    return;
  }

  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      console.log("No auth token available, cannot send FCM token to backend");
      return;
    }

    console.log("Sending FCM token to backend...");
    const response = await axios.post(
      `${BASE_URL}/notifications/register-token`,
      { fcmToken: token, platform: Platform.OS },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        timeout: 5000,
      }
    );

    console.log("Token sent to backend successfully:", response.data);
  } catch (error) {
    console.error("Backend token registration error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
};

export const setupMessageListeners = (router) => {
  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    console.log("Foreground message:", JSON.stringify(remoteMessage));
    // Handle foreground messages here
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("Notification opened app:", remoteMessage);
    // Handle notification opening app here
  });

  messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
      console.log("App opened from quit state:", remoteMessage);
      // Handle app opened from quit state here
    }
  });

  return unsubscribeForeground;
};
