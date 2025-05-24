import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.samToken

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access - No token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized access - Invalid token" })
    }

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized access - User not found" })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" })
  }
}
