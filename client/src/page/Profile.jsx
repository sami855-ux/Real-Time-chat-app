import { LogOut, Settings, User, Zap, Upload, Pencil } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link, useNavigate } from "react-router-dom"
import { logoutUser, updateProfile } from "@/service/userApi"
import toast from "react-hot-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth, logout } from "@/store/auth"
import avater from "@/assets/avater.png"

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(user.profilePic || "")
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: user.fullName || "fullName",
    },
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await logoutUser()
      if (res.success) {
        toast.success("Logout successful!")
        dispatch(logout())
        navigate("/login")
      } else {
        toast.error(res.message || "Logout failed. Please try again.")
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      )
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)

      setValue("profilePic", file)
    }
  }

  const onSubmit = async (data) => {
    if (!data.profilePic) {
      toast.error("Please select a profile picture.")
      return
    }

    console.log(data)

    const fromData = new FormData()
    fromData.append("profilePic", data.profilePic)
    fromData.append("fullName", data.fullName)

    try {
      setIsLoading(true)
      const res = await updateProfile(fromData)

      if (res.success) {
        toast.success("Profile updated successfully!")
        setPreviewImage(res.user.profilePic)
        setValue("fullName", res.user.fullName)
        dispatch(checkAuth())
        setValue("profilePic", null)
      } else {
        toast.error(
          res.data.message || "Failed to update profile. Please try again."
        )
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
      return
    } finally {
      setIsLoading(false)
      setIsEditing(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen">
        <header className="h-16 px-12 w-full bg-white border-b border-gray-200 flex justify-between items-center">
          <Link to={"/home"} className="flex items-center gap-2">
            <Zap
              className="w-6 h-6 text-black animate-pulse"
              fill="black"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl font-bold">Pulse</h1>
          </Link>
          <div className="flex items-center gap-2">
            {/* Profile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded hover:bg-muted transition">
                  <Link to="/profile">
                    <User className="w-5 h-5 cursor-pointer" />
                  </Link>
                </button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>

            {/* Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded hover:bg-muted transition">
                  <Link to="/setting">
                    <Settings className="w-5 h-5 cursor-pointer" />
                  </Link>
                </button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            {/* Logout */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded hover:bg-muted transition">
                  <LogOut
                    className="w-5 h-5 cursor-pointer text-red-500"
                    onClick={handleLogout}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <main className="flex flex-col gap-6 p-8 pt-12 items-center max-w-2xl mx-auto">
          <div className="relative group">
            <Avatar className="w-32 h-32">
              <AvatarImage src={previewImage} />
              <AvatarFallback>
                <img src={avater} className="img-fluid rounded-circle" alt="" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
              >
                <Upload className="w-5 h-5" />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {isEditing ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    {...register("fullName", { required: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" disabled value={user.email} />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                {isLoading ? (
                  <Button type="submit" disabled>
                    Updating...
                  </Button>
                ) : (
                  <Button type="submit">Save Changes</Button>
                )}
              </div>
            </form>
          ) : (
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <Button
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  )
}
