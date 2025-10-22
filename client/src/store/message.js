import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selectedChat: null,
}

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setSelectedChatStore: (state, action) => {
      state.selectedChat = action.payload
    },
  },
})

export const { setSelectedChatStore } = messageSlice.actions

export default messageSlice.reducer
