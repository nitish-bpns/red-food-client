import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/MenuStyles";

const MenuFilter = ({ activeFilter, setActiveFilter }) => {
  return (
    <View style={styles.filters}>
      {["all", "veg", "non-veg"].map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            activeFilter === filter && styles.activeFilterButton,
          ]}
          onPress={() => setActiveFilter(filter)}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText,
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuFilter;
