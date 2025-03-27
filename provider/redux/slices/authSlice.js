import api from "@/utils/api.js";
import { BASE_URL } from "../../../utils/const.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getProfileOnRefresh = createAsyncThunk(
    "auth/getProfileOnRefresh",
    async () => {
        const response = await api.get(BASE_URL + "/users/profile", {
            withCredentials: true
        });

        return response.data.data;
    }
)

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async () => {
        const response = await axios.post(BASE_URL + "/users/refresh-access-token",
            {},
            {
                withCredentials: true
            }
        )

        return response.data
    }
)

export const logoutThunk = createAsyncThunk(
    "auth/logoutThunk",
    async () => {
        const response = await axios.post(BASE_URL + "/users/logout", {}, { withCredentials: true });
        return response.data
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isOpen: false,
        modalType: "",
        isLoggedIn: false,
        user: null
    },
    reducers: {
        toggleModal(state, action) {
            state.isOpen = action.payload.isOpen
            state.modalType = action.payload.modalType || state.modalType
            state.isLoggedIn = action.payload.isLoggedIn || state.isLoggedIn
            state.user = action.payload.userData || state.user
        },
        logout(state, action) {
            state.isOpen = false
            state.modalType = ""
            state.isLoggedIn = false
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isOpen = false
                state.modalType = ""
                state.isLoggedIn = true
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isOpen = true
                state.modalType = "Login"
                state.isLoggedIn = false
                state.user = null
            })
            .addCase(logoutThunk.fulfilled, (state, action) => {
                state.isOpen = false
                state.modalType = ""
                state.isLoggedIn = false
                state.user = null
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.isOpen = false
                state.modalType = ""
            })
            .addCase(getProfileOnRefresh.fulfilled, (state, action) => {
                state.isOpen = false
                state.modalType = ""
                state.isLoggedIn = true
                state.user = action.payload
            })
            .addCase(getProfileOnRefresh.rejected, (state, action) => {
                state.isOpen = true
                state.modalType = "Login"
                state.isLoggedIn = false
                state.user = null
            })
    }
})

export const { toggleModal, logout } = authSlice.actions;
export default authSlice.reducer;