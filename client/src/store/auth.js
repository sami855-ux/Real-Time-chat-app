import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosInstance } from "@/service/userApi"

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/check")
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to check auth"
      )
    }
  }
)

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isSigningUp: false,
  isLogging: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLogging = false
      state.isSigningUp = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        const { user } = action.payload
        state.isAuthenticated = true
        state.user = user
        state.isLoading = false
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isLoading = false
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
