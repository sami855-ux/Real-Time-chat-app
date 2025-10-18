import { LogOut, Settings, User, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { logoutUser } from "@/service/userApi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/store/auth";
import ThemeToggle from "@/helper/ThemeToogler";
import ChatInterface from "@/components/ChatInterface";
import { useEffect, useState } from "react";
import { fetchMessagedUsers } from "@/store/user";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Mock user data - replace with actual user data from your store
  const userData = {
    fullName: user?.fullName || "John Doe",
    email: user?.email || "john.doe@example.com",
    profilePic: user?.profilePic || "/placeholder.svg",
  };

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
    } finally {
      setLogoutDialogOpen(false);
    }
  };

  useEffect(() => {
    dispatch(fetchMessagedUsers());
  }, [dispatch]);

  return (
    <TooltipProvider>
      <div className="w-full min-h-screen">
        <header className="h-16 px-4 md:px-12 w-full bg-white border-b border-gray-200 flex justify-between items-center">
          <Link to={"/home"} className="flex items-center gap-2">
            <Zap
              className="w-6 h-6 text-black animate-pulse"
              fill="black"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl font-bold">Pulse </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Combined User Profile Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-all duration-200 border border-transparent hover:border-amber-200">
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
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {userData.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                          {userData.email}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Account Settings</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                className="w-64 bg-white/95 backdrop-blur-sm border-gray-200 rounded-xl shadow-xl"
                align="end"
              >
                {/* User Profile Section */}
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-amber-100">
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
                      <p className="text-sm font-semibold text-gray-900 truncate capitalize">
                        {userData.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-amber-100" />

                {/* Profile Link */}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-amber-50"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 w-full px-2 py-2"
                  >
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Profile
                      </p>
                      <p className="text-xs text-gray-500">View your profile</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                {/* Settings Link */}
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-amber-50"
                >
                  <Link
                    to="/setting"
                    className="flex items-center gap-3 w-full px-2 py-2"
                  >
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Settings
                      </p>
                      <p className="text-xs text-gray-500">App preferences</p>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-amber-100" />

                {/* Logout Button */}
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-50 text-red-600"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <div className="flex items-center gap-3 w-full px-2 py-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Logout</p>
                      <p className="text-xs text-red-500">
                        Sign out of your account
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="w-full h-[calc(100vh-64px)] pt-4">
          <ChatInterface />
        </main>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-gray-200 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 text-center">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 mt-2">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-8 h-8 text-amber-600" />
              </div>
              <p className="text-sm text-gray-500 text-center">
                You're currently signed in as
                <br />
                <span className="font-semibold text-gray-900">
                  {userData.email}
                </span>
              </p>
            </div>

            <DialogFooter className="flex space-x-7 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
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
  );
}
