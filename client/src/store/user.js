import { axiosInstance } from "@/service/userApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMessagedUsers = createAsyncThunk(
  "users/fetchMessagedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/message/conversation");

      // Basic validation in case backend structure changes
      if (!response.data || !response.data.result) {
        console.log(response.data);
        return rejectWithValue("Invalid response structure from server");
      }

      return response.data.result;
    } catch (error) {
      console.error("Error fetching messaged users:", error);

      // Extract a readable message
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch messaged users";

      return rejectWithValue(message);
    }
  }
);

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

const initialState = {
  selectedUser: loadSelectedUser(),
  users: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      console.log(action.payload);
      state.selectedUser = action.payload;

      // Persist to localStorage
      try {
        localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      } catch (e) {
        console.warn("Failed to save selectedUser", e);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessagedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;

        console.log(state.users);
      })
      .addCase(fetchMessagedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        console.log(state.error);
      });
  },
});

export const { setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
