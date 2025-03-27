import { StyleSheet } from "react-native";

const CartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  cartList: {
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    color: "#555",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#E23744",
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#E23744",
  },
  actionButtonText: {
    fontSize: 16,
  },
  addButtonText: {
    color: "#FFFFFF",
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  summary: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    elevation: 2,
  },
  orderPlaceBox: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeOrderButton: {
    backgroundColor: "#E23744",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 16,
  },
  addButtonLarge: {
    backgroundColor: "#22AC00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonTextLarge: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#D3D3D3",
    marginVertical: 5,
  },
  deliveringto: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deliveryText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 0,
    marginTop: 5,
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "red",
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noteContainer: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  nlabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  ninput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top", // Ensures text starts from the top in multiline mode
  },
});

export default CartStyles;
