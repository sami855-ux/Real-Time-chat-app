import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import connectDB from "./lib/db.js"

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/message", messageRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB()
})
