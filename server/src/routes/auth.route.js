import express from "express"
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controller/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import upload from "../lib/multer.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
)

router.get("/check", protectRoute, checkAuth)

export default router
