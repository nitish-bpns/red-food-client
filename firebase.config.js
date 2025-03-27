import messaging from '@react-native-firebase/messaging';

// Firebase configuration from your updated google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyC040ctEYr3xlzxLFQX_O0jU4uFH4qx5gw",
  authDomain: "red-food-club.firebaseapp.com",
  projectId: "red-food-club",
  storageBucket: "red-food-club.firebasestorage.app",
  messagingSenderId: "569255817686",
  appId: "1:569255817686:android:bf755de1d4381659a7f477"
};

// Request notification permission
async function requestNotificationPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } else {
      console.log('Unable to get notification permission');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export { 
  firebaseConfig, 
  requestNotificationPermission 
};