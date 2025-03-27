import { StyleSheet } from "react-native";

const MenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },

  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  modalCloseButton: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    elevation: 5,
    padding: 8,
  },
  activeFilterButton: {
    backgroundColor: "#E23744",
  },
  filterText: {
    fontSize: 14,
    color: "#777",
  },
  activeFilterText: {
    color: "#fff",
  },
  categoryContainer: {
    marginBottom: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  leftHalf: {
    flex: 1,
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  vegIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  heartButton: {
    marginLeft: 10,
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  priceFavoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  itemPriceModal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  rightHalf: {
    alignItems: "center",
    width: "25%",
  },
  itemImage: {
    width: 70,
    height: 65,
    borderRadius: 8,
    marginBottom: 5,
  },
  addButton: {
    paddingHorizontal: 25,
    paddingVertical: 8,
    backgroundColor: "#E23744",
    borderRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    padding: 9,
    borderRadius: 4,
    backgroundColor: "#E23744",
  },
  counterButtonMinus: {
    marginRight: 8,
  },
  counterButtonPlus: {
    marginLeft: 8,
  },
  counterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  itemCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalDetailsContainer: {
    marginTop: 15,
    width: "100%",
    alignItems: "left",
  },
  addButtonModal: {
    marginTop: 15,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#E23744",
    borderRadius: 8,
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
  },
  counterContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  removeFavoriteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: "red",
    borderRadius: 4,
    marginLeft: 10,
  },
  removeFavoriteText: {
    // color: "#fff",
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
  noFavoritesText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },

  // header
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#E23744",
    elevation: 3,
  },
  logoAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 25,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginTop: 50,
    marginRight: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalItemText: {
    fontSize: 16,
    padding: 10,
  },
  // not available button
  notAvailableButton: {
    backgroundColor: "#CCCCCC",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: "100%",
    height: 36,
  },
  notAvailableText: {
    color: "#666666",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 12,
  },
});

export default MenuStyles;
