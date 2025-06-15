import { axiosInstance } from "@/service/userApi"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axiosInstance.get("/auth/users")
  return response.data.users
})

const initialState = {
  selectedUser: null,
  users: null,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      console.log(action.payload)
      state.selectedUser = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const { setSelectedUser } = userSlice.actions
export default userSlice.reducer
