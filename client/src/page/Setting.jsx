"use client"

import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { logoutUser } from "@/service/userApi"
import { logout } from "@/store/auth"
import {
  LogOut,
  Settings,
  User,
  Zap,
  Bell,
  Shield,
  Palette,
  Database,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Archive,
  UserX,
} from "lucide-react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

export default function Setting() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    soundNotifications: true,
    desktopNotifications: true,
    mobileNotifications: true,
    messagePreview: true,
    notificationSound: "default",

    // Privacy
    readReceipts: true,
    onlineStatus: true,
    lastSeen: "everyone",
    profilePhoto: "everyone",

    // Appearance
    theme: "system",
    fontSize: [14],
    chatBackground: "default",
    messageAnimation: true,

    // Storage
    autoDownloadPhotos: true,
    autoDownloadVideos: false,
    autoDownloadDocuments: false,
    autoDeleteMessages: "never",

    // Advanced
    language: "en",
    keyboardShortcuts: true,
  })

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

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast.success("Setting updated!")
  }

  const handleClearAllChats = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all chat history? This action cannot be undone."
      )
    ) {
      toast.success("All chats cleared!")
    }
  }

  const handleExportData = () => {
    toast.success(
      "Data export started! You'll receive a download link via email."
    )
  }

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast.error("Account deletion initiated. You have 30 days to cancel.")
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
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

        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-600">
                Manage your chat preferences and account settings
              </p>
            </div>
          </div>

          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Sound Notifications</p>
                  <p className="text-sm text-gray-600">
                    Play sound for new messages
                  </p>
                </div>
                <Switch
                  checked={settings.soundNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("soundNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Desktop Notifications</p>
                  <p className="text-sm text-gray-600">
                    Show notifications on desktop
                  </p>
                </div>
                <Switch
                  checked={settings.desktopNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("desktopNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Mobile Push Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive push notifications on mobile
                  </p>
                </div>
                <Switch
                  checked={settings.mobileNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("mobileNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Message Preview</p>
                  <p className="text-sm text-gray-600">
                    Show message content in notifications
                  </p>
                </div>
                <Switch
                  checked={settings.messagePreview}
                  onCheckedChange={(checked) =>
                    updateSetting("messagePreview", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">Notification Sound</p>
                <Select
                  value={settings.notificationSound}
                  onValueChange={(value) =>
                    updateSetting("notificationSound", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control who can see your information and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Read Receipts</p>
                  <p className="text-sm text-gray-600">
                    Let others know when you've read their messages
                  </p>
                </div>
                <Switch
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) =>
                    updateSetting("readReceipts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Online Status</p>
                  <p className="text-sm text-gray-600">
                    Show when you're online
                  </p>
                </div>
                <Switch
                  checked={settings.onlineStatus}
                  onCheckedChange={(checked) =>
                    updateSetting("onlineStatus", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">Last Seen</p>
                <Select
                  value={settings.lastSeen}
                  onValueChange={(value) => updateSetting("lastSeen", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="contacts">My Contacts</SelectItem>
                    <SelectItem value="nobody">Nobody</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Profile Photo</p>
                <Select
                  value={settings.profilePhoto}
                  onValueChange={(value) =>
                    updateSetting("profilePhoto", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="contacts">My Contacts</SelectItem>
                    <SelectItem value="nobody">Nobody</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/blocked-users")}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Manage Blocked Users
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your chat experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Theme</p>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => updateSetting("theme", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Font Size</p>
                <div className="px-3">
                  <Slider
                    value={settings.fontSize}
                    onValueChange={(value) => updateSetting("fontSize", value)}
                    max={20}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Small</span>
                    <span>{settings.fontSize[0]}px</span>
                    <span>Large</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Chat Background</p>
                <Select
                  value={settings.chatBackground}
                  onValueChange={(value) =>
                    updateSetting("chatBackground", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="gradient1">Blue Gradient</SelectItem>
                    <SelectItem value="gradient2">Purple Gradient</SelectItem>
                    <SelectItem value="pattern1">Geometric Pattern</SelectItem>
                    <SelectItem value="custom">Custom Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Message Animations</p>
                  <p className="text-sm text-gray-600">
                    Animate message sending and receiving
                  </p>
                </div>
                <Switch
                  checked={settings.messageAnimation}
                  onCheckedChange={(checked) =>
                    updateSetting("messageAnimation", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Storage & Data Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Storage & Data
              </CardTitle>
              <CardDescription>
                Manage your data usage and storage preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">2.4 GB</p>
                  <p className="text-sm text-gray-600">Total Storage Used</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">1.8 GB</p>
                  <p className="text-sm text-gray-600">Media Files</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">0.6 GB</p>
                  <p className="text-sm text-gray-600">Messages</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Auto-Download Media</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Photos</span>
                  </div>
                  <Switch
                    checked={settings.autoDownloadPhotos}
                    onCheckedChange={(checked) =>
                      updateSetting("autoDownloadPhotos", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Videos</span>
                  </div>
                  <Switch
                    checked={settings.autoDownloadVideos}
                    onCheckedChange={(checked) =>
                      updateSetting("autoDownloadVideos", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Documents</span>
                  </div>
                  <Switch
                    checked={settings.autoDownloadDocuments}
                    onCheckedChange={(checked) =>
                      updateSetting("autoDownloadDocuments", checked)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Auto-Delete Messages</p>
                <Select
                  value={settings.autoDeleteMessages}
                  onValueChange={(value) =>
                    updateSetting("autoDeleteMessages", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1day">After 1 Day</SelectItem>
                    <SelectItem value="1week">After 1 Week</SelectItem>
                    <SelectItem value="1month">After 1 Month</SelectItem>
                    <SelectItem value="3months">After 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-orange-600 hover:text-orange-700"
                  onClick={handleClearAllChats}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Clear All Chat History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced
              </CardTitle>
              <CardDescription>
                Advanced settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Language</p>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting("language", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Keyboard Shortcuts</p>
                  <p className="text-sm text-gray-600">
                    Enable keyboard shortcuts for faster navigation
                  </p>
                </div>
                <Switch
                  checked={settings.keyboardShortcuts}
                  onCheckedChange={(checked) =>
                    updateSetting("keyboardShortcuts", checked)
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>App Version</span>
                  <Badge variant="secondary">v2.1.0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that will affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </TooltipProvider>
  )
}
