import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import addressReducer from "./slices/addressSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
  },
});

export default store;
