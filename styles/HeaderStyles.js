import { StyleSheet } from "react-native";

const HeaderStyles = StyleSheet.create({
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
    fontSize: 12,
    color: "white",
  },
  contactText: {
    marginLeft: 5,
    fontSize: 10,
    color: "white",
  },
  addressTextBlack: {
    marginLeft: 5,
    fontSize: 12,
    color: "black",
  },
  contactTextBlack: {
    marginLeft: 5,
    fontSize: 10,
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darken the backdrop
  },
  modalWrapper: {
    width: 300,
    maxHeight: "80%",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalItemText: {
    fontSize: 14,
    padding: 10,
  },
  modalItemText: {
    fontSize: 16,
    paddingVertical: 6,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
    color: "#333",
  },
  addNewText: {
    fontSize: 16,
    color: "#E23744",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F9F9F9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E23744",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#E23744",
    fontSize: 16,
    fontWeight: "bold",
  },
  okButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#E23744",
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    marginBottom: 15,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#F9F9F9",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  addressInfo: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
  },
});

export default HeaderStyles;
