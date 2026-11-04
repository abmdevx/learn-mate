import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppwriteUser, AuthState } from "../types";

const initialState: AuthState = {
    status: false,
    userData: null,
    loading: true,   // <--- initially true until we check session
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AppwriteUser>) => {
            state.status = true;
            state.userData = action.payload;
            state.loading = false;
            state.error = null; // reset error on success
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.loading = false;
            state.error = null;
        },
        finishLoading: (state) => {
            state.loading = false;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { login, logout, finishLoading, setError, clearError } = authSlice.actions;

export default authSlice.reducer;