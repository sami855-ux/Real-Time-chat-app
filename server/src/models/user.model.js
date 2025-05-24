import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default:
        "https://www.vecteezy.com/vector-art/13042571-default-avatar-profile-icon-vector-social-media-user-photo-in-flat-style",
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model("User", userSchema)

export default User
