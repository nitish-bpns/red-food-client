import React, { useState } from "react";
import { View, Image } from "react-native";
import styles from "../../styles/HeaderStyles";
import AddressContainer from "./AddressContainer";
import { Link } from "expo-router";

const Header = () => {
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
    </View>
  );
};

export default Header;
