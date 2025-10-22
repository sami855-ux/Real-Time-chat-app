import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import {
  getMessages,
  getUserConversations,
  sendMessage,
  getOrCreateConversation,
  markConversationAsRead,
} from "../controller/message.controller.js"
import upload from "../middleware/multer.middleware.js"

const router = express.Router()

// Create or get a conversation between two users
router.post("/:receiverId", getOrCreateConversation)

//send a message to user
router.post("/sender/:id", protectRoute, upload.array("images", 4), sendMessage)

// Get a message  from conversation
router.get("/conversation/:conversationId", getMessages)

// Get all users from conversation
router.get("/conversation", protectRoute, getUserConversations)

//Set isRead messages to true
router.put("/read/:conversationId", markConversationAsRead)

export default router
