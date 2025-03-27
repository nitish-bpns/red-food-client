// import api from "@/utils/api";
import { BASE_URL } from "@/utils/const";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../utils/api";

export const getCartOnRefresh = createAsyncThunk(
  "cart/getCartOnRefresh",
  async () => {
    const response = await api.get("/carts/get-cart", {
      withCredentials: true,
    });

    // Filter out unavailable items
    const filteredItems = response.data.data.items.filter(
      (item) => item.menu.isAvailable !== false
    );

    // If there are unavailable items, update the cart on backend
    const unavailableItems = response.data.data.items.filter(
      (item) => item.menu.isAvailable === false
    );

    // Remove unavailable items from backend cart if any exist
    if (unavailableItems.length > 0) {
      // We could make API calls to remove these items from the backend cart
      // For each unavailable item, make a call to remove it
      await Promise.all(
        unavailableItems.map((item) =>
          api
            .patch(
              "/carts/reduce-from-cart/",
              {
                menuId: item.menu._id,
                quantity: item.quantity,
              },
              {
                withCredentials: true,
              }
            )
            .catch((err) =>
              console.log("Error removing unavailable item:", err)
            )
        )
      );
    }

    return filteredItems;
  }
);

export const addItemToCartBackend = createAsyncThunk(
  "cart/addItemToCartBackend",
  async ({ menuId, price }) => {
    console.log("firstdebug");
    const response = await api.post(
      "/carts/add-to-cart",
      {
        menuId: menuId,
        quantity: 1,
      },
      {
        withCredentials: true,
      }
    );

    console.log("response", response);
    return response.data;
  }
);

export const removeItemFromCartBackend = createAsyncThunk(
  "cart/removeItemFromCartBackend",
  async ({ name, menuId, price }) => {
    const response = await api.patch(
      "/carts/reduce-from-cart/",
      {
        menuId: menuId,
        quantity: 1,
      },
      {
        withCredentials: true,
      }
    );

    console.log("response", response);
    return response.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalQuantity: 0,
    totalPrice: 0,
    items: [],
  },
  reducers: {
    addNewItem(state, action) {
      const newItem = {
        menu: action.payload.menu,
        quantity: action.payload.quantity,
        _id: action.payload._id,
      };
      state.items.push(newItem);
      if (state.totalQuantity == null) {
        state.totalQuantity = 1;
      } else {
        state.totalQuantity += 1;
      }
      if (state.totalPrice == null) {
        state.totalPrice = action.payload.menu.price;
      } else {
        state.totalPrice += action.payload.menu.price;
      }
    },
    addSameItem(state, action) {
      console.log("state.totalQuantity");

      state.totalQuantity += 1;
      state.totalPrice += action.payload.price;

      state.items.forEach((item) => {
        if (item.menu._id == action.payload.menuId) {
          item.quantity++;
        }
      });
      console.log("action.payload.menu", action);
    },
    removeItem(state, action) {
      state.items.forEach((item) => {
        if (item.menu._id == action.payload.menuId) {
          item.quantity -= 1;
        }
      });

      state.items = state.items.filter((item) => {
        return item.quantity > 0;
      });

      state.totalQuantity -= 1;
      state.totalPrice -= action.payload.price;
    },
    clearCart(state, action) {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCartBackend.fulfilled, (state, action) => {
        console.log("add item fullfilled");
      })
      .addCase(addItemToCartBackend.rejected, (state, action) => {
        console.log("first");
        console.log("action", action);
        state.items.forEach((item) => {
          if (item.menu._id == action.meta.arg.menuId) {
            item.quantity -= 1;
          }
        });

        state.items = state.items.filter((item) => {
          return item.quantity > 0;
        });

        state.totalQuantity -= 1;
        state.totalPrice -= action.meta.arg.price;
      })
      .addCase(removeItemFromCartBackend.fulfilled, (state, action) => {
        // Nothing to do here
      })
      .addCase(removeItemFromCartBackend.rejected, (state, action) => {
        let alreadyPresent = false;

        state.items.forEach((item) => {
          if (item.menu._id == action.meta.arg.menuId) {
            alreadyPresent = true;
            item.quantity++;
          }
        });

        if (!alreadyPresent) {
          const newItem = {
            menu: action.meta.arg.menu,
            quantity: action.meta.arg.quantity,
            _id: action.meta.arg._id,
          };
          state.items.push(newItem);
        }
        state.totalQuantity += 1;
        state.totalPrice += action.meta.arg.price;
      })
      .addCase(getCartOnRefresh.fulfilled, (state, action) => {
        console.log("action", action);
        state.items = action.payload;

        let totalPrice = 0;
        let totalQuantity = 0;
        action.payload.forEach((item) => {
          totalQuantity += item.quantity;
          totalPrice += item.quantity * item.menu.price;
        });

        console.log("totalPrice, totalQuantity", totalPrice, totalQuantity);

        state.totalPrice = totalPrice;
        state.totalQuantity = totalQuantity;
      })
      .addCase(getCartOnRefresh.rejected, (state, action) => {
        state.items = [];
        state.totalPrice = 0;
        state.totalQuantity = 0;
      });
  },
});

export const { addNewItem, addSameItem, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
