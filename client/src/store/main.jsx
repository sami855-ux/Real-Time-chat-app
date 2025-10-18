import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth.js";
import userReducer from "./user.js";

const loadSelectedUser = () => {
  try {
    const saved = localStorage.getItem("selectedUser");
    console.log("Loaded selectedUser from localStorage:", saved);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn("Failed to load selectedUser from localStorage", e);
    return null;
  }
};

const preloadedState = {
  userSlice: {
    selectedUser: loadSelectedUser(),
    users: null,
    isLoading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  preloadedState,
});

// Subscribe to changes and save selectedUser
store.subscribe(() => {
  try {
    const state = store.getState();

    console.log(state);
    const selectedUser = state.user.selectedUser;
    localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
  } catch (e) {
    console.warn("Failed to save selectedUser to localStorage", e);
  }
});

export default store;
