import { LogOut, Settings, User, Zap } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import toast from "react-hot-toast"
import { logoutUser } from "@/service/userApi"
import { Link } from "react-router-dom"

export default function Home() {
  const handleLogout = async () => {
    try {
      const res = await logoutUser()
      if (res.success) {
        toast.success("Logout successful!")
        window.location.href = "/login"
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
            <h1 className="text-2xl font-bold">Pulse </h1>
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

        <main className="flex min-h-[calc(100vh-64px)] flex-col gap-2 p-8 pt-4">
          <div className="">
            <h2 className="text-2xl font-bold">Connect in Real-Time</h2>
            <p className="pt-1 text-sm text-gray-600">
              Pulse delivers lightning-fast messaging with end-to-end
              encryption.
            </p>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
