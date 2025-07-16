// filepath: /D:/Github/App/restro-fe/components/Header/AddressContainer.js
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/HeaderStyles";
import {
  fetchAddresses,
  fetchHostels,
  handleRemoveAddress,
  handleSelectAddress,
  handleAddNewAddress,
  setSelectedAddress,
} from "../../provider/redux/slices/addressSlice";
import { useRoute } from "@react-navigation/native";

const AddressContainer = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addresses);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);
  const hostels = useSelector((state) => state.address.hostels);
  const loading = useSelector((state) => state.address.loading);
  const [modalVisible, setModalVisible] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [hostelSearchQuery, setHostelSearchQuery] = useState("");
  const route = useRoute();
  const isCartScreen = route.name === "cart";

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Filter hostels based on search query
  const filteredHostels = useMemo(() => {
    if (!hostelSearchQuery.trim()) {
      return hostels;
    }
    return hostels.filter((hostel) =>
      hostel.name.toLowerCase().includes(hostelSearchQuery.toLowerCase())
    );
  }, [hostels, hostelSearchQuery]);

  const handleSelectAddressLocal = async (address) => {
    setProcessing(true);
    try {
      await dispatch(handleSelectAddress(address)).unwrap();
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating default address:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddNewAddressLocal = async () => {
    if (!selectedHostel) {
      alert("Please select a hostel.");
      return;
    }

    if (!contactNumber.trim()) {
      alert("Please enter a contact number.");
      return;
    }

    // Validate phone number is exactly 10 digits
    const trimmedNumber = contactNumber.trim();
    const phoneRegex = /^\d+$/;
    
    if (!phoneRegex.test(trimmedNumber)) {
      alert("Enter 10 Digit Contact no.");
      return;
    }

    if (trimmedNumber.length < 10) {
      alert("Enter 10 Digit Contact no.");
      return;
    }

    if (trimmedNumber.length !== 10) {
      alert("Enter 10 Digit Contact no.");
      return;
    }

    setProcessing(true);

    try {
      await dispatch(
        handleAddNewAddress({ selectedHostel, contactNumber: trimmedNumber })
      ).unwrap();
      setModalVisible(false);
      setAddingNew(false);
      // Reset form
      setSelectedHostel(null);
      setContactNumber("");
      setHostelSearchQuery("");
    } catch (error) {
      console.error("Error adding new address:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
    if (!dropdownVisible) {
      // Clear search when opening dropdown
      setHostelSearchQuery("");
    }
  };

  const handleHostelSelect = (hostel) => {
    setSelectedHostel(hostel);
    setDropdownVisible(false);
    setHostelSearchQuery("");
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setAddingNew(false);
    setSelectedHostel(null);
    setContactNumber("");
    setHostelSearchQuery("");
    setDropdownVisible(false);
  };

  return (
    <View>
      {/* Address Selector */}
      <TouchableOpacity
        style={styles.addressContainer}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons
          name="location-outline"
          size={20}
          color={isCartScreen ? "black" : "white"}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#333" />
        ) : (
          <View>
            <Text
              style={
                isCartScreen ? styles.addressTextBlack : styles.addressText
              }
            >
              {selectedAddress
                ? selectedAddress?.hostel?.name
                : "Select Address"}
            </Text>
            <Text
              style={
                isCartScreen ? styles.contactTextBlack : styles.contactText
              }
            >
              {selectedAddress ? selectedAddress?.contactNumber : ""}
            </Text>
          </View>
        )}
        <Ionicons
          name="chevron-down"
          size={20}
          color={isCartScreen ? "black" : "white"}
        />
      </TouchableOpacity>

      {/* Address Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleModalClose}
        >
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              {addingNew ? (
                <>
                  <TouchableOpacity
                    onPress={() => setAddingNew(false)}
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                  </TouchableOpacity>

                  {/* Dropdown Button for Selecting Hostel */}
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={handleDropdownToggle}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {selectedHostel ? selectedHostel.name : "Select Hostel"}
                    </Text>
                    <Ionicons 
                      name={dropdownVisible ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#333" 
                    />
                  </TouchableOpacity>

                  {/* Dropdown List with Search */}
                  {dropdownVisible && (
                    <View style={styles.dropdownContainer}>
                      {/* Search Input */}
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search hostels..."
                        value={hostelSearchQuery}
                        onChangeText={setHostelSearchQuery}
                        autoCapitalize="none"
                      />
                      
                      {/* Scrollable Hostel List */}
                      <ScrollView 
                        style={styles.dropdownList}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                      >
                        {filteredHostels.length > 0 ? (
                          filteredHostels.map((item) => (
                            <TouchableOpacity
                              key={item._id}
                              style={styles.dropdownItem}
                              onPress={() => handleHostelSelect(item)}
                            >
                              <Text style={styles.dropdownItemText}>
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>
                              No hostels found
                            </Text>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Enter 10 Digit Phone No."
                    keyboardType="phone-pad"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    maxLength={10}
                  />

                  {processing ? (
                    <ActivityIndicator size="small" color="#333" />
                  ) : (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={handleModalClose}
                        style={styles.cancelButton}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleAddNewAddressLocal}
                        style={styles.okButton}
                      >
                        <Text style={styles.okButtonText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <FlatList
                    data={addresses}
                    keyExtractor={(item) => item._id}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <View style={styles.addressItem}>
                        <TouchableOpacity
                          onPress={() => handleSelectAddressLocal(item)}
                          style={styles.addressInfo}
                        >
                          <Text style={styles.modalItemText}>
                            {item?.hostel?.name} - {item.contactNumber}
                          </Text>
                        </TouchableOpacity>

                        {/* Remove Button */}
                        <TouchableOpacity
                          onPress={() => dispatch(handleRemoveAddress(item))}
                          style={styles.removeButton}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="red"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setAddingNew(true);
                      dispatch(fetchHostels());
                    }}
                  >
                    <Text style={styles.addNewText}>+ Add New Address</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AddressContainer;