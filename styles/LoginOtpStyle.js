import { StyleSheet } from "react-native";

const LoginOtpStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    height: 45,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  inputLabel: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  otpContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  otpSection: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "90%",
    height: 45,
    backgroundColor: "#f25c05",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  linkText: {
    color: "#f25c05",
    fontWeight: "bold",
  },
});

export default LoginOtpStyles;
