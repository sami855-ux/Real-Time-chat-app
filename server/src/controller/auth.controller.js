import bcrypt from "bcryptjs"

import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudniary.js"

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body
  try {
    if (!email || !fullName || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields", success: false })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this Email already exists",
        success: false,
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    })

    if (newUser) {
      //generate web token
      generateToken(newUser._id, res)

      await newUser.save()
      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic,
        },
      })
    } else {
      return res
        .status(400)
        .json({ message: "User creation failed", success: false })
    }
  } catch (error) {
    console.log("Error in signup:", error.message)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false })
    }
    console.log(user)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false })
    }

    //generate web token
    generateToken(user._id, res)

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
      },
      success: true,
    })
  } catch (error) {
    console.log("Error in login:", error.message)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}
export const logout = async (req, res) => {
  try {
    res.clearCookie("samToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    return res.status(200).json({ message: "Logout successful", success: true })
  } catch (error) {
    console.log("Error in logout:", error.message)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body
    const profilePic = req.file
    const userId = req.user._id

    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Profile picture is required", success: false })
    }

    // Upload buffer to Cloudinary using stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profilePics" },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )
        stream.end(buffer)
      })
    }

    const uploadResponse = await streamUpload(profilePic.buffer)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
        fullName: fullName || req.user.fullName,
      },
      { new: true }
    )

    console.log(updatedUser)
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    })
  } catch (error) {
    console.error("Error in updateProfile:", error.message)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        profilePic: req.user.profilePic,
      },
    })
  } catch (error) {
    console.log("Error in checkAuth:", error.message)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}
