import { getAuthToken } from "./auth";
import { BASE_URL } from "./const";

export const fetchAddresses = async (
  setAddresses,
  setSelectedAddress,
  setLoading
) => {
  setLoading(true);
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/delivery-addresses/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      setAddresses(data.data);
      const defaultAddr = data.data.find((addr) => addr.isDefault);
      setSelectedAddress(defaultAddr || data.data[0]);
    } else {
      console.error("Failed to fetch addresses:", data.message);
    }
  } catch (error) {
    console.error("Error fetching addresses:", error);
  } finally {
    setLoading(false);
  }
};

export const handleSelectAddress = async (
  address,
  setSelectedAddress,
  setModalVisible,
  setAddresses
) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${BASE_URL}/delivery-addresses/addressDefault`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: address.hostel._id,
          userId: address.user,
        }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      setSelectedAddress(address);
      setModalVisible(false);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.hostel._id === address.hostel._id,
        }))
      );
    } else {
      console.error("Failed to update default address:", data.message);
    }
  } catch (error) {
    console.error("Error updating default address:", error);
  }
};

export const fetchHostels = async (setHostels) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/delivery-addresses/hostel`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      setHostels(data.data);
    } else {
      console.error("Failed to fetch hostels:", data.message);
    }
  } catch (error) {
    console.error("Error fetching hostels:", error);
  }
};

export const handleRemoveAddress = async (address, setAddresses) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${BASE_URL}/delivery-addresses/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hostelId: address.hostel._id,
        contactNumber: address.contactNumber,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setAddresses((prev) =>
        prev.filter(
          (addr) =>
            addr.hostel._id !== address.hostel._id ||
            addr.contactNumber !== address.contactNumber
        )
      );
    } else {
      console.error("Failed to remove address:", data.message);
    }
  } catch (error) {
    console.error("Error removing address:", error);
  }
};
