// src/store/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/appwrite/auth"; 
import { login, logout, finishLoading, setError } from "./AuthSlice";
import { normalizeUserData } from "./Helper";
import type { AppwriteUser, SignupData } from "../types";

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

// ✅ Signup & auto-login
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData: SignupData, { dispatch, rejectWithValue }) => {
    try {
      // console.log("userData in thunk:", userData);
      const formattedData = normalizeUserData(userData);
      const user = await authService.createAccount(formattedData);
      if (!user) {
        return rejectWithValue("Account creation failed");
      }
      dispatch(login(user)); // update Redux
      return user;
    } catch (error: unknown) {
      const message = errorMessage(error, "Signup failed");
      dispatch(setError(message)); // store error in Redux
      return rejectWithValue(message);
    }
  }
);

// ✅ Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const user = await authService.login({ email, password });
      dispatch(login(user));
      return user;
    } catch (error: unknown) {
      const message = errorMessage(error, "Invalid email or password");
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
      const user = await Promise.race<AppwriteUser | null>([
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
    } catch (error: unknown) {
      dispatch(setError(errorMessage(error, "Session check failed")));
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
    } catch (error: unknown) {
      const message = errorMessage(error, "Logout failed");
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);