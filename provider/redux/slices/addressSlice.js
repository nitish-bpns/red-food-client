// filepath: /D:/Github/App/restro-fe/provider/redux/slices/addressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthToken } from "../../../utils/auth";
import { BASE_URL } from "../../../utils/const";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/delivery-addresses/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHostels = createAsyncThunk(
  "address/fetchHostels",
  async (_, { rejectWithValue }) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/delivery-addresses/hostel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleRemoveAddress = createAsyncThunk(
  "address/handleRemoveAddress",
  async (address, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/delivery-addresses/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostelId: address.hostel._id,
          contactNumber: address.contactNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const state = getState();
        const addresses = state.address.addresses.filter(
          (addr) =>
            addr.hostel._id !== address.hostel._id ||
            addr.contactNumber !== address.contactNumber
        );

        // Update selected address if the removed address was the selected one
        if (state.address.selectedAddress._id === address._id) {
          const newSelectedAddress = addresses.length > 0 ? addresses[0] : null;
          dispatch(setSelectedAddress(newSelectedAddress));
        }

        return address;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleSelectAddress = createAsyncThunk(
  "address/handleSelectAddress",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${BASE_URL}/delivery-addresses/addressDefault`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: address._id,
            userId: address.user,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(setSelectedAddress(address));
        dispatch(fetchAddresses());
        return address;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const handleAddNewAddress = createAsyncThunk(
  "address/handleAddNewAddress",
  async ({ selectedHostel, contactNumber }, { dispatch, rejectWithValue }) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${BASE_URL}/delivery-addresses/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostelId: selectedHostel._id,
          contactNumber,
          isDefault: true,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(fetchAddresses());
        return data.data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    selectedAddress: null,
    hostels: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        const defaultAddr = action.payload.find((addr) => addr.isDefault);
        state.selectedAddress = defaultAddr || action.payload[0];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHostels.fulfilled, (state, action) => {
        state.hostels = action.payload;
      })
      .addCase(handleRemoveAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (addr) =>
            addr.hostel._id !== action.payload.hostel._id ||
            addr.contactNumber !== action.payload.contactNumber
        );
      })
      .addCase(handleSelectAddress.fulfilled, (state, action) => {
        state.selectedAddress = action.payload;
      })
      .addCase(handleAddNewAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      });
  },
});

export const { setSelectedAddress } = addressSlice.actions;

export default addressSlice.reducer;