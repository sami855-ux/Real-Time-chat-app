import { LogOut, Settings, User, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { logoutUser } from "@/service/userApi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/store/auth";
import ThemeToggle from "@/helper/ThemeToogler";
import ChatInterface from "@/components/ChatInterface";
import { useEffect } from "react";
import { fetchMessagedUsers } from "@/store/user";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.success) {
        toast.success("Logout successful!");
        navigate("/login");

        dispatch(checkAuth());
      } else {
        toast.error(res.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    }
  };

  useEffect(() => {
    dispatch(fetchMessagedUsers());
  }, [dispatch]);

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
            <ThemeToggle />
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

        <main className="w-full h-[calc(100vh-64px)] pt-4">
          <ChatInterface />
        </main>
      </div>
    </TooltipProvider>
  );
}
