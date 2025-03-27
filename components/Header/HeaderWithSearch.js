import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/MenuStyles";
import AddressContainer from "./AddressContainer";
import { Link } from "expo-router";

const MenuSearch = ({ searchText, setSearchText }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Select Address");

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoAddressContainer}>
        <Link href="(screens)/">
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
          />
        </Link>
        <AddressContainer
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
      </View>

      <View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search menu..."
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

export default MenuSearch;
