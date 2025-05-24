import cloudinary from "../lib/cloudniary.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    )

    res.status(200).json({
      message: "Users fetched successfully",
      users: filteredUsers,
    })
  } catch (error) {
    console.log("Error in getUserForSidebar:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const senderId = req.user._id

    const messages = await Message.find({
      $or: [
        { senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    })
      .populate("senderId", "-password")
      .populate("receiverId", "-password")
      .sort({ createdAt: 1 })

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    })
  } catch (error) {
    console.log("Error in getMessages:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    let imageUrl

    if (image) {
      const cloudResponse = await cloudinary.uploader.upload(image, {
        folder: "messages",
      })
      imageUrl = cloudResponse.secure_url
    }

    const newMessage = await Message.create({
      text,
      image: imageUrl,
      senderId,
      receiverId,
    })

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    })
  } catch (error) {
    console.log("Error in sendMessage:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}
