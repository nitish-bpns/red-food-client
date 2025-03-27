// filepath: /D:/Github/App/restro-fe/components/Header/AddressContainer.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
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
  const route = useRoute();
  const isCartScreen = route.name === "cart";

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

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
    if (!selectedHostel || !contactNumber.trim()) {
      alert("Please select a hostel and enter a contact number.");
      return;
    }

    setProcessing(true);

    try {
      await dispatch(
        handleAddNewAddress({ selectedHostel, contactNumber })
      ).unwrap();
      setModalVisible(false);
      setAddingNew(false);
    } catch (error) {
      console.error("Error adding new address:", error);
    } finally {
      setProcessing(false);
    }
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
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalWrapper}>
            <View style={styles.modalContent}>
              {/* <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}> */}
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
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {selectedHostel ? selectedHostel.name : "Select Hostel"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  </TouchableOpacity>

                  {/* Dropdown List */}
                  {dropdownVisible && (
                    <View style={styles.dropdownList}>
                      {hostels.map((item) => (
                        <TouchableOpacity
                          key={item._id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedHostel(item);
                            setDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Contact Number"
                    keyboardType="phone-pad"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                  />

                  {processing ? (
                    <ActivityIndicator size="small" color="#333" />
                  ) : (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
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
              {/* </TouchableOpacity> */}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AddressContainer;
