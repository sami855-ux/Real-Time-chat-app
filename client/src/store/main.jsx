import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth.js"
import userReducer from "./user.js"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
})

export default store
