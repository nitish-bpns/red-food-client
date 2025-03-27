import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import { Platform, Alert, Linking, AppState } from "react-native";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";
import * as Notifications from "expo-notifications";

import { getAuthToken } from "@/utils/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import ReduxProvider from "./../provider/redux/ReduxProvider";
import Wrapper from "./../components/Wrapper";
import { BASE_URL } from "@/utils/const";
import axios from "axios";

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp();
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [fcmToken, setFcmToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const appInitialized = useRef(false);
  const notificationPermissionRequested = useRef(false);

  // Create notification channel for Android - optimized to run only once
  const createNotificationChannel = async () => {
    if (Platform.OS === "android") {
      try {
        await messaging().android.createChannel({
          id: "default-channel",
          name: "Default Channel",
          description: "Default notification channel",
          importance: 4, // High importance
          sound: "default",
          vibration: true,
        });
        console.log("Notification channel created successfully");
      } catch (error) {
        console.error("Failed to create notification channel:", error);
      }
    }
  };

  // Check authentication and route to signin if not authenticated
  const checkAuthAndRoute = async () => {
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        console.log("No auth token, routing to signin");
        router.replace("(auth)/signin");
        setIsAuthenticated(false);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      router.replace("(auth)/signin");
      setIsAuthenticated(false);
      return false;
    }
  };

  // Send FCM token to backend with retry logic
  async function sendTokenToBackend(token) {
    if (!token) {
      console.log("No token to send to backend");
      return;
    }

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const authToken = await getAuthToken();
        if (!authToken) {
          console.log(
            "No auth token available, cannot send FCM token to backend"
          );
          return;
        }

        console.log(`Sending FCM token to backend (attempt ${retries + 1})...`);
        const response = await axios.post(
          `${BASE_URL}/notifications/register-token`,
          {
            fcmToken: token,
            platform: Platform.OS,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            timeout: 10000, // Increased timeout
          }
        );

        console.log("Token sent to backend successfully");
        return true;
      } catch (error) {
        retries++;
        console.error(
          `Backend token registration error (attempt ${retries}):`,
          {
            message: error.message,
            status: error.response?.status,
          }
        );

        if (retries >= maxRetries) {
          console.log("Max retries reached for token registration");
          return false;
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  // Request notification permissions using Expo - optimized to request only once
  async function requestNotificationPermission() {
    if (notificationPermissionRequested.current) {
      return true;
    }

    try {
      // Request permission using Expo Notifications
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      notificationPermissionRequested.current = true;

      if (finalStatus !== "granted") {
        console.log("Notification permission denied");
        Alert.alert(
          "Notification Permissions",
          "Notifications are disabled. You can enable them in device settings to receive important updates.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Later", style: "cancel" },
          ]
        );
        return false;
      }

      console.log("Notification permission granted");
      return true;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  // Get FCM token with optimized flow
  async function getFCMTokenAndStore() {
    try {
      // Get token
      const token = await messaging().getToken();
      console.log("FCM Token obtained:", token);
      setFcmToken(token);
      return token;
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  }

  // Setup message listeners with improved navigation handling
  const setupMessageListeners = () => {
    // Foreground message handler with custom notification display
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground message received:", remoteMessage);

        if (remoteMessage.notification) {
          // Use Expo Notifications for consistent display
          await Notifications.scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification.title || "New Notification",
              body: remoteMessage.notification.body || "You have a new message",
              data: remoteMessage.data || {},
            },
            trigger: null, // Show immediately
          });
        }
      }
    );

    // Background/Quit state handlers
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app:", remoteMessage);

      if (remoteMessage.data?.orderId) {
        setTimeout(() => {
          router.push(`(screens)/orders/${remoteMessage.data.orderId}`);
        }, 1000); // Delay to ensure app is ready
      }
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("App opened from quit state:", remoteMessage);

          if (remoteMessage.data?.orderId) {
            setTimeout(() => {
              router.push(`(screens)/orders/${remoteMessage.data.orderId}`);
            }, 1500); // Longer delay for cold start
          }
        }
      });

    // Setup handler for Expo notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Notification response received:", data);

        if (data.orderId) {
          router.push(`(screens)/orders/${data.orderId}`);
        }
      }
    );

    return () => {
      unsubscribeForeground();
      subscription.remove();
    };
  };

  // Initialize app with proper sequence
  useEffect(() => {
    const initializeApp = async () => {
      if (appInitialized.current) return;
      appInitialized.current = true;

      try {
        // First create notification channel
        await createNotificationChannel();

        // Then request permissions early
        await requestNotificationPermission();

        // Check authentication
        const isAuth = await checkAuthAndRoute();
        if (!isAuth) return;

        // Get FCM token after auth is confirmed
        const token = await getFCMTokenAndStore();

        // Send token to backend if we have it
        if (token) {
          await sendTokenToBackend(token);
        }

        // Setup token refresh listener
        const unsubscribeTokenRefresh = messaging().onTokenRefresh(
          async (newToken) => {
            console.log("FCM Token refreshed");
            setFcmToken(newToken);
            await sendTokenToBackend(newToken);
          }
        );

        return () => {
          unsubscribeTokenRefresh();
        };
      } catch (error) {
        console.error("App initialization failed:", error);
      }
    };

    initializeApp();
  }, []);

  // Setup message listeners after authentication is confirmed
  useEffect(() => {
    let cleanup;

    if (isAuthenticated) {
      cleanup = setupMessageListeners();
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isAuthenticated]);

  // Handle app state changes with debounce
  useEffect(() => {
    let debounceTimeout;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground");

        // Clear any existing timeout
        if (debounceTimeout) clearTimeout(debounceTimeout);

        // Debounce to prevent multiple calls
        debounceTimeout = setTimeout(() => {
          checkAuthAndRoute().then((isAuth) => {
            if (isAuth) {
              // Refresh token when app comes to foreground
              getFCMTokenAndStore().then((token) => {
                if (token) {
                  sendTokenToBackend(token);
                }
              });
            }
          });
        }, 1000);
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [appState]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ReduxProvider>
      <ThemeProvider value={DefaultTheme}>
        <Wrapper>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(auth)/signin"
          >
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </Wrapper>
      </ThemeProvider>
    </ReduxProvider>
  );
}
