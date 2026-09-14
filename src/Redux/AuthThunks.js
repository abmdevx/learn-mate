// src/store/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../appwrite/auth"; 
import { login, logout, finishLoading, setError } from "./AuthSlice";
import { normalizeUserData } from "./Helper";

// ✅ Signup & auto-login
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      // console.log("userData in thunk:", userData);
      const formattedData = normalizeUserData(userData);
      const user = await authService.createAccount(formattedData);
      dispatch(login(user)); // update Redux
      return user;
    } catch (error) {
      dispatch(setError(error.message)); // store error in Redux
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const user = await authService.login({ email, password });
      dispatch(login(user));
      return user;
    } catch (error) {
      const message = error.message || "Invalid email or password";
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

// ✅ Check session (on app start)
export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { dispatch }) => {
    try {
      const user = await Promise.race([
        authService.getCurrentUser(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Session check timed out")), 10000);
        }),
      ]);
      if (user) {
        dispatch(login(user));
      } else {
        dispatch(finishLoading()); // no session
      }
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(finishLoading());
    }
  }
);

// ✅ Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);