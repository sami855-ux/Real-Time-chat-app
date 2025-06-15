import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL)

    console.log(`MongoDB connected: ${connect.connection.host}`)
  } catch (error) {
    console.log(error)
    console.log(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
