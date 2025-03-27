import { useDispatch } from "react-redux";
import { getProfileOnRefresh } from "../provider/redux/slices/authSlice";
import { getCartOnRefresh } from "../provider/redux/slices/cartSlice";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Wrapper({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch(getProfileOnRefresh());
        dispatch(getCartOnRefresh());
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
}
