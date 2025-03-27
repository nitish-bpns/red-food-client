import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import styles from "../../styles/MenuStyles";
import { BASE_URL } from "../../utils/const";
import { getAuthToken } from "../../utils/auth";
import FavoriteList from "../../components/Favorites/FavoriteList";
import Header from "../../components/Header/Header";
import { getCartOnRefresh } from "../../provider/redux/slices/cartSlice";
import { updateCart } from "../../utils/updateCart";

export default function FavouriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restroStatus, setRestroStatus] = useState("open");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const checkAuth = async () => {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        navigation.navigate("(auth)/signin");
        return;
      }
    };

    checkAuth();
  }, [navigation]);

  const fetchRestroStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/get-restro-status`);
      setRestroStatus(response?.data?.data.status);
    } catch (error) {
      console.error("Error fetching restro status:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const authToken = await getAuthToken();
      const response = await axios.get(`${BASE_URL}/menus/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        const favoriteMenus = response.data.data
          .flatMap((category) => category.menus)
          .filter((menu) => menu.isFavorite);
        setFavorites(favoriteMenus);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert("Error", "Failed to fetch favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // update cart
  const handleUpdateCart = (item, quantity) => {
    updateCart(item, quantity, dispatch, cart);
  };

  const removeFavorite = async (menuId) => {
    try {
      const authToken = await getAuthToken();
      await axios.delete(`${BASE_URL}/menus/favorite/${menuId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setFavorites((prev) => prev.filter((item) => item._id !== menuId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert("Error", "Failed to remove favorite. Please try again.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
      fetchRestroStatus();
      getCartOnRefresh(dispatch);
    }, [])
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : favorites.length === 0 ? (
          <Text style={styles.noFavoritesText}>No favorites yet.</Text>
        ) : (
          <FavoriteList
            favorites={favorites}
            removeFavorite={removeFavorite}
            updateCart={handleUpdateCart}
            cart={cart}
            restroStatus={restroStatus}
          />
        )}
      </View>
    </>
  );
}
