import {
  LogOut,
  Search,
  Settings,
  User,
  Zap,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import toast from "react-hot-toast"
import { logoutUser } from "@/service/userApi"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "@/store/auth"
import { useTheme } from "@/helper/ThemeProvider"
import ChatInterface from "@/components/ChatInterface"
import { useEffect, useState } from "react"
import UserSearchModal from "@/components/UserSearchModal"

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)

  // Mock user data - replace with actual user data from your store
  const userData = {
    fullName: user?.fullName || "John Doe",
    email: user?.email || "john.doe@example.com",
    profilePic: user?.profilePic || "/placeholder.svg",
  }

  const handleLogout = async () => {
    try {
      const res = await logoutUser()
      if (res.success) {
        toast.success("Logout successful!")
        navigate("/login")
        dispatch(checkAuth())
      } else {
        toast.error(res.message || "Logout failed. Please try again.")
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      )
    } finally {
      setLogoutDialogOpen(false)
    }
  }

  useEffect(() => {}, [dispatch])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isThemeDropdownOpen && !event.target.closest(".modalll")) {
        setIsThemeDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isThemeDropdownOpen])

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen relative">
        <header className="h-[80px] px-4 pt-4 md:px-12 w-full bg-background border-b border-border d flex justify-between items-center">
          <Link to={"/home"} className="flex items-center gap-2">
            <Zap
              className="w-6 h-6 text-black dark:text-white animate-pulse"
              fill="currentColor"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl font-bold dark:text-white">Pulse </h1>
          </Link>
          <div className="flex items-center gap-4">
            <UserSearchModal />

            {/* Combined User Profile Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-2 w-44 rounded-lg hover:bg-amber-50 dark:hover:bg-accent transition-all duration-200 border border-transparent hover:border-amber-200 dark:hover:border-border">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={userData.profilePic}
                          alt={userData.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold uppercase">
                          {userData.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {userData.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                          {userData.email}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Account Settings</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                className="w-64 bg-background backdrop-blur-sm border-accent rounded-md shadow-xl overflow-visible relative z-[50]"
                align="end"
              >
                {/* User Profile Section */}
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-amber dark:ring-gray-300">
                      <AvatarImage
                        src={userData.profilePic}
                        alt={userData.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold uppercase">
                        {userData.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate capitalize">
                        {userData.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userData.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Online
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-amber-100 dark:bg-muted" />

                {/* Theme Selection Dropdown */}
                <div className="modalll">
                  <div
                    className="flex items-center gap-3 w-full px-2 py-2 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      {theme === "light" ? (
                        <Sun className="w-4 h-4 text-amber-600 dark:text-white" />
                      ) : theme === "dark" ? (
                        <Moon className="w-4 h-4 text-amber-600 dark:text-white" />
                      ) : (
                        <Monitor className="w-4 h-4 text-amber-600 dark:text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Theme
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {theme === "light"
                          ? "Light"
                          : theme === "dark"
                          ? "Dark"
                          : "System"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isThemeDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Theme Dropdown Menu (Left Floating) */}
                  {isThemeDropdownOpen && (
                    <div
                      className="absolute -left-[260px]  top-32 bg-background border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] w-64 overflow-hidden"
                      style={{ transform: "translateY(-10%)" }}
                    >
                      {/* Light Theme Option */}
                      <div
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                          theme === "light"
                            ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          setTheme("light")
                          setIsThemeDropdownOpen(false)
                        }}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            theme === "light"
                              ? "bg-amber-200 dark:bg-amber-800"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <Sun
                            className={`w-4 h-4 ${
                              theme === "light"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Light</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Bright theme
                          </p>
                        </div>
                        {theme === "light" && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        )}
                      </div>

                      {/* Dark Theme Option */}
                      <div
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                          theme === "dark"
                            ? "bg-muted text-amber-700 dark:text-amber-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          setTheme("dark")
                          setIsThemeDropdownOpen(false)
                        }}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            theme === "dark"
                              ? "bg-secondary "
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <Moon
                            className={`w-4 h-4 ${
                              theme === "dark"
                                ? "text-background"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Dark</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Dark theme
                          </p>
                        </div>
                        {theme === "dark" && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        )}
                      </div>

                      {/* System Theme Option */}
                      <div
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                          theme === "system"
                            ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          setTheme("system")
                          setIsThemeDropdownOpen(false)
                        }}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            theme === "system"
                              ? "bg-amber-200 dark:bg-amber-800"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <Monitor
                            className={`w-4 h-4 ${
                              theme === "system"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">System</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Follow system
                          </p>
                        </div>
                        {theme === "system" && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-900/20"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 w-full px-2 py-2"
                  >
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Profile
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        View your profile
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Settings Link */}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-amber-50 dark:focus:bg-amber-900/20"
                >
                  <Link
                    to="/setting"
                    className="flex items-center gap-3 w-full px-2 py-2"
                  >
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Settings
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        App preferences
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-amber-100 dark:bg-muted" />

                {/* Logout Button */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <div className="flex items-center gap-3 w-full px-2 py-2">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Logout</p>
                      <p className="text-xs text-red-500 dark:text-red-400">
                        Sign out of your account
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="w-full h-[calc(100vh-4rem)] flex">
          <ChatInterface />
        </main>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className="max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-700 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white text-center">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 dark:text-gray-400 mt-2">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                You're currently signed in as
                <br />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {userData.email}
                </span>
              </p>
            </div>

            <DialogFooter className="flex space-x-7 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
                className="flex-1 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm"
              >
                Yes, Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
