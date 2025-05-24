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
        .json({ message: "Please provide all required fields" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this Email already exists" })
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
        user: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic,
        },
      })
    } else {
      return res.status(400).json({ message: "User creation failed" })
    }
  } catch (error) {
    console.log("Error in signup:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    console.log(user)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" })
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
    })
  } catch (error) {
    console.log("Error in login:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const logout = async (req, res) => {
  try {
    res.clearCookie("samToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    return res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.log("Error in logout:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" })
    }

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    //Update user profile picture in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    )

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.log("Error in updateProfile:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({
      user: {
        _id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        profilePic: req.user.profilePic,
      },
    })
  } catch (error) {
    console.log("Error in checkAuth:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
