import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../controller/message.controller.js"

const router = express.Router()

router.get("/user", protectRoute, getUserForSidebar)
router.get("/:id", protectRoute, getMessages)
router.post("/sender/:id", protectRoute, sendMessage)
export default router
