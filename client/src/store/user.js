import { createSlice } from "@reduxjs/toolkit"

const loadSelectedUser = () => {
  try {
    const saved = localStorage.getItem("selectedUser")
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    console.warn("Failed to load selectedUser from localStorage", e)
    return null
  }
}

const initialState = {
  selectedUser: loadSelectedUser(),
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload

      try {
        localStorage.setItem("selectedUser", JSON.stringify(action.payload))
      } catch (e) {
        console.warn("Failed to save selectedUser", e)
      }
    },
  },
})

export const { setSelectedUser } = userSlice.actions
export default userSlice.reducer
