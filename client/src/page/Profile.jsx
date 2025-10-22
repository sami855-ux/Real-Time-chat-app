import {
  LogOut,
  Settings,
  User,
  Zap,
  Upload,
  Pencil,
  Camera,
  Save,
  X,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth, logout } from "@/store/auth"

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(user?.profilePic || "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "Hey there! I am using Pulse.",
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
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)

      setValue("profilePic", file)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const formData = new FormData()
      if (data.profilePic instanceof File) {
        formData.append("profilePic", data.profilePic)
      }
      formData.append("fullName", data.fullName.trim())
      formData.append("bio", data.bio.trim())

      const res = await updateProfile(formData)

      if (res.success) {
        toast.success("Profile updated successfully!")
        setPreviewImage(res.user.profilePic)
        dispatch(checkAuth())
        setIsEditing(false)
      } else {
        toast.error(
          res.message || "Failed to update profile. Please try again."
        )
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setPreviewImage(user?.profilePic || "")
    setValue("fullName", user?.fullName || "")
    setValue("bio", user?.bio || "Hey there! I am using Pulse.")
  }

  const profileCompletion =
    user?.bio && user.bio !== "Hey there! I am using Pulse." ? 100 : 80

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen bg-background">
        <header className="h-16 px-4 md:px-12 w-full bg-background border-b border-border flex justify-between items-center">
          <Link to={"/home"} className="flex items-center gap-2">
            <Zap
              className="w-6 h-6 text-primary animate-pulse"
              fill="currentColor"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl font-bold text-foreground">Pulse</h1>
          </Link>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Link to="/profile">
                    <User className="w-5 h-5" />
                  </Link>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Profile</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Link to="/setting">
                    <Settings className="w-5 h-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar Section */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                    <AvatarImage
                      src={previewImage}
                      alt={user?.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold uppercase">
                      {user?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <label
                      htmlFor="profile-picture"
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-white" />
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

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="fullName"
                            className="text-sm font-medium"
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            {...register("fullName", {
                              required: "Full name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters",
                              },
                              maxLength: {
                                value: 50,
                                message: "Name must be less than 50 characters",
                              },
                            })}
                            className="w-full"
                          />
                          {errors.fullName && (
                            <p className="text-sm text-destructive">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            disabled
                            value={user?.email}
                            className="w-full bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Email cannot be changed
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          {...register("bio", {
                            maxLength: {
                              value: 120,
                              message: "Bio must be less than 120 characters",
                            },
                          })}
                          placeholder="Tell us something about yourself..."
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex justify-between items-center">
                          {errors.bio && (
                            <p className="text-sm text-destructive">
                              {errors.bio.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground ml-auto">
                            {watch("bio")?.length || 0}/120
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 justify-end pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground capitalize">
                          {user?.fullName}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                          {user?.email}
                        </p>
                      </div>

                      <div className="max-w-2xl">
                        <p className="text-foreground leading-relaxed">
                          {user?.bio || "Hey there! I am using Pulse."}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Online</span>
                        </div>
                        <span>•</span>
                        <span>
                          Member since{" "}
                          {new Date(user?.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Button
                        onClick={() => setIsEditing(true)}
                        className="mt-6 gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Additional Info Section */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="h-2 w-2 rounded-full p-0 bg-green-500 border-0"
                      />
                      <span className="text-sm text-muted-foreground">
                        Active
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Last Updated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user?.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={profileCompletion} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {profileCompletion}% complete
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
