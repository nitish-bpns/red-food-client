import { Link, Tabs, usePathname } from "expo-router";
import React from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;
  const pathname = usePathname(); // Get current route pathname

  const isCartOrProfileScreen = pathname === "/cart" || pathname === "/profile"; // Hide button on Cart & Profile screens

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favourite"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="favorite.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color }) => (
              <View>
                <IconSymbol size={28} name="shopping-cart.fill" color={color} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Go to Cart Button (Hidden on Cart & Profile Pages) */}
      {cartCount > 0 && !isCartOrProfileScreen && (
        <Link href="/cart" asChild>
          <TouchableOpacity style={styles.goToCartButton} activeOpacity={0.8}>
            <Text style={styles.goToCartText}>Go to Cart</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#E23744",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  goToCartButton: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: "#E23744",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  goToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
