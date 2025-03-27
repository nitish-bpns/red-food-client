import axios from "axios";
import { BASE_URL } from "./const";
import { getAuthToken } from "./auth"; // Assuming you have a separate file for auth functions

export const handleFavorite = async (menuId, profile, setFavorites, setSelectedItem) => {
  try {
    const authToken = await getAuthToken();
    if (!profile?._id || !authToken) throw new Error("Missing authentication info");

    const response = await axios.post(
      `${BASE_URL}/menus/favorite/${menuId}`,
      { user: profile._id, menu: menuId },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );

    if (response.status === 200) {
      setFavorites((prev) => ({ ...prev, [menuId]: true }));
      setSelectedItem((prev) =>
        prev?._id === menuId ? { ...prev, isFavorite: true } : prev
      );
    }
  } catch (error) {
    console.error("Error updating favorite:", error);
  }
};

export const removeFavorite = async (menuId, profile, setFavorites, setSelectedItem) => {
  try {
    const authToken = await getAuthToken();
    if (!profile?._id || !authToken) throw new Error("Missing authentication info");

    const response = await axios.delete(
      `${BASE_URL}/menus/favorite/${menuId}`,
      {
        data: { user: profile._id, menu: menuId },
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (response.status === 200) {
      setFavorites((prev) => ({ ...prev, [menuId]: false }));
      setSelectedItem((prev) =>
        prev?._id === menuId ? { ...prev, isFavorite: false } : prev
      );
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

export const toggleFavorite = async (itemId, profile, favorites, setFavorites, setSelectedItem, selectedItem) => {
  try {
    const isCurrentlyFavorite = favorites[itemId] ?? selectedItem?.isFavorite;

    if (isCurrentlyFavorite) {
      await removeFavorite(itemId, profile, setFavorites, setSelectedItem);
    } else {
      await handleFavorite(itemId, profile, setFavorites, setSelectedItem);
    }

    setFavorites((prev) => ({
      ...prev,
      [itemId]: !isCurrentlyFavorite,
    }));

    if (selectedItem?._id === itemId) {
      setSelectedItem((prev) => ({
        ...prev,
        isFavorite: !isCurrentlyFavorite,
      }));
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

