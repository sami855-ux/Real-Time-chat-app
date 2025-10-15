import { axiosInstance } from "@/service/userApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch users
// export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
//   const response = await axiosInstance.get("/auth/users");
//   return response.data.users;
// });

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

const initialState = {
  selectedUser: null,
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
