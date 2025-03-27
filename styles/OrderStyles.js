import { StyleSheet } from "react-native";

const OrderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9FB",
    padding: 16,
  },
  orderDetails: {
    marginLeft: 15,
    marginRight: 15, // Added space at the bottom for the tab
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 48, // Increased space for the back arrow
    color: "black",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderPIN: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4, // Increased spacing between item rows
  },
  item: {
    fontSize: 16,
    marginBottom: 2, // Added margin to the text for spacing
  },
  itemQuantity: {
    fontSize: 16,
    color: "#888",
    marginBottom: 0,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 2,
  },
  subHeading2: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 4,
  },
  priceBreakdown: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  table: {
    marginTop: 2,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableText: {
    fontSize: 14,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12, // Increased margin for better spacing
  },
  orderDate: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  ordersList: {
    marginBottom: 80, // Added space at the bottom for the tab
  },
});

export default OrderStyles;
