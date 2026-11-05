// src/store/Store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";   // ✅ import the reducer

const Store = configureStore({
  reducer: {
    auth: authReducer,   // <--- now thunks will dispatch actions into this slice
  },
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;