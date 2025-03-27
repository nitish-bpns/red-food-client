import { StyleSheet } from "react-native";

const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 16,
  },
  userInfoSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  userEmail: {
    fontSize: 14,
    color: "#888888",
    marginTop: 4,
  },
  editIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  editText: {
    color: "#E23744",
    fontWeight: "bold",
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    fontSize: 16,
    color: "#000000",
  },
  badge: {
    fontSize: 14,
    float: "right",
    color: "#E23744",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 16,
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: "#E23744",
    fontWeight: "bold",
  },
});

export default ProfileStyles;