import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Alert, Text, TouchableOpacity } from "react-native";
import api from "../../utils/api";
import axios from "axios";
import styles from "../../styles/MenuStyles";
import MenuModal from "../../components/Menu/MenuModal";
import MenuFilter from "../../components/Menu/MenuFilter";
import MenuList from "../../components/Menu/MenuList";
import { BASE_URL } from "../../utils/const";
import { getAuthToken } from "../../utils/auth";
import { getCartOnRefresh } from "../../provider/redux/slices/cartSlice";
import { getProfileOnRefresh } from "../../provider/redux/slices/authSlice";
import { handleFavorite, toggleFavorite } from "../../utils/FavoritesUtils";
import MenuSearch from "../../components/Header/HeaderWithSearch";
import { updateCart } from "../../utils/updateCart";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function MenuPage() {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [menu, setMenu] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const [restroStatus, setRestroStatus] = useState("Open");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const userProfile = async () => {
    try {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        throw new Error("No auth token found");
      }

      const response = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${yourAuthToken}`,
        },
      });
      setProfile(response?.data?.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

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

  const fetchMenu = async () => {
    setLoading(true);
    setError(false);

    try {
      const yourAuthToken = await getAuthToken();
      if (!yourAuthToken) {
        navigation.navigate("(auth)/signin");
        return;
      }

      const response = await api.get("/menus/all");
      if (response.status === 200) {
        setMenu(response.data.data);
        userProfile();
        dispatch(getProfileOnRefresh());
        dispatch(getCartOnRefresh());
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMenu();
      fetchRestroStatus();
    }, [])
  );

  // Initial load
  useEffect(() => {
    fetchMenu();
    fetchRestroStatus();
  }, [dispatch, navigation]);

  // update cart
  const handleUpdateCart = (item, quantity) => {
    updateCart(item, quantity, dispatch, cart);
  };

  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(!modalVisible);
  };

  const toggleFavoriteHandler = async (itemId) => {
    await toggleFavorite(
      itemId,
      profile,
      favorites,
      setFavorites,
      setSelectedItem,
      selectedItem
    );
  };

  // Render error state with refresh button
  const renderErrorState = () => (
    <View
      style={
        styles.errorContainer || {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }
      }
    >
      <Text
        style={
          styles.errorText || {
            fontSize: 16,
            marginBottom: 20,
            textAlign: "center",
          }
        }
      >
        Could not load menu
      </Text>
      <TouchableOpacity
        style={
          styles.refreshButton || {
            backgroundColor: "#007BFF",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }
        }
        onPress={fetchMenu}
        disabled={loading}
      >
        <Text
          style={
            styles.refreshButtonText || { color: "white", fontWeight: "bold" }
          }
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <MenuSearch searchText={searchText} setSearchText={setSearchText} />
      {!restroStatus && (
        <Text
          style={
            styles.errorText || {
              fontSize: 16,
              marginBottom: 20,
              textAlign: "center",
            }
          }
        >
          Red Food is currently not serving. Kindly visit us later. (Operation
          Time: 9 PM - 5 AM, Sunday Closed)
        </Text>
      )}
      <View style={styles.container}>
        {error ? (
          renderErrorState()
        ) : (
          <>
            {/* Menu filter */}
            <MenuFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
            {/* Menu List  */}
            <MenuList
              menu={menu}
              activeFilter={activeFilter}
              searchText={searchText}
              cart={cart}
              updateCart={handleUpdateCart}
              toggleFavorite={toggleFavoriteHandler}
              toggleModal={toggleModal}
              favorites={favorites}
              loading={loading}
              restroStatus={restroStatus}
            />

            {/* Modal for expanded menu details */}
            {selectedItem && (
              <MenuModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                selectedItem={selectedItem}
                toggleFavorite={toggleFavoriteHandler}
                favorites={favorites}
                cart={cart}
                updateCart={handleUpdateCart}
                handleFavorite={handleFavorite}
                restroStatus={restroStatus}
              />
            )}
          </>
        )}
      </View>
    </>
  );
}
