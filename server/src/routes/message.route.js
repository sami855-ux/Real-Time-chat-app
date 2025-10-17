import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUserConversations,
  sendMessage,
  getOrCreateConversation,
} from "../controller/message.controller.js";

const router = express.Router();

// Create or get a conversation between two users
router.post("/:receiverId", getOrCreateConversation);

//send a message to user
router.post("/sender/:id", sendMessage);

// Get a message  from conversation
router.get("/conversation/:conversationId", getMessages);

// Get all users from conversation
router.get("/conversation", protectRoute, getUserConversations);

export default router;
