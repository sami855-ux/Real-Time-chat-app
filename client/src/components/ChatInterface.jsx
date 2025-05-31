"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Zap,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import FilePreview from "./FilePreview"
import EmojiPicker from "./EmojiPicker"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState("1")
  const [message, setMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showFilePreview, setShowFilePreview] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const emojiButtonRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hey! How are you doing?",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      senderName: "Alice Johnson",
    },
    {
      id: "2",
      text: "I'm doing great! Just working on some new features for our app.",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "3",
      text: "That sounds exciting! Can't wait to see what you've built. The real-time messaging looks amazing!",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      senderName: "Alice Johnson",
    },
    {
      id: "4",
      text: "I'll show you a demo later today. The real-time features are working perfectly!",
      sender: "user",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
  ])

  const [chats] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      lastMessage: "That sounds exciting! Can't wait to see...",
      timestamp: "2 min ago",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Bob Smith",
      lastMessage: "Thanks for the help with the project!",
      timestamp: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      name: "Team Chat",
      lastMessage: "Meeting at 3 PM today",
      timestamp: "3 hours ago",
      unreadCount: 5,
      isOnline: true,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      lastMessage: "Let's catch up soon!",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "5",
      name: "Development Team",
      lastMessage: "New deployment is ready for testing",
      timestamp: "2 days ago",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "6",
      name: "Marketing Group",
      lastMessage: "Campaign results are in!",
      timestamp: "2 days ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "7",
      name: "John Doe",
      lastMessage: "Did you see the latest update?",
      timestamp: "3 days ago",
      unreadCount: 3,
      isOnline: true,
    },
    {
      id: "8",
      name: "Emma Thompson",
      lastMessage: "The design looks great!",
      timestamp: "4 days ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "9",
      name: "Michael Brown",
      lastMessage: "Let's schedule a call next week",
      timestamp: "5 days ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "10",
      name: "Support Team",
      lastMessage: "Issue #1234 has been resolved",
      timestamp: "1 week ago",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "11",
      name: "David Wilson",
      lastMessage: "Thanks for your help!",
      timestamp: "1 week ago",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "12",
      name: "Sophia Garcia",
      lastMessage: "The presentation went well",
      timestamp: "2 weeks ago",
      unreadCount: 0,
      isOnline: false,
    },
  ])

  const messagesEndRef = useRef(null)

  // Click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEmojiPicker])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if ((message.trim() || selectedFiles.length > 0) && selectedChat) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: "user",
        timestamp: new Date(),
        files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
      }
      setMessages((prev) => [...prev, newMessage])
      setMessage("")
      setSelectedFiles([])
      setShowFilePreview(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const fileObjects = files.map((file) => ({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }))
      setSelectedFiles(fileObjects)
      setShowFilePreview(true)
    }
  }

  const handleEmojiSelect = (emoji) => {
    const input = messageInputRef.current
    if (input) {
      const start = input.selectionStart
      const end = input.selectionEnd
      const newMessage = message.slice(0, start) + emoji + message.slice(end)
      setMessage(newMessage)

      // Set cursor position after emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.length
        input.focus()
      }, 0)
    }
    setShowEmojiPicker(false)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    )
  }

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId)
    setIsSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const renderMessageContent = (msg) => {
    return (
      <div>
        {msg.files && msg.files.length > 0 && (
          <div className="mb-2">
            {msg.files.map((fileObj) => (
              <div key={fileObj.id} className="mb-2">
                {fileObj.type.startsWith("image/") ? (
                  <img
                    src={fileObj.url || "/placeholder.svg"}
                    alt={fileObj.name}
                    className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                  />
                ) : (
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 border">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium">{fileObj.name}</p>
                        <p className="text-xs opacity-75">
                          {formatFileSize(fileObj.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {msg.text && <p className="text-sm break-words">{msg.text}</p>}
      </div>
    )
  }

  return (
    <div className="flex w-full h-[87vh] relative overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Chat List - FIXED */}
      <div
        className={`
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:relative fixed left-0 top-0 z-50
      w-80 sm:w-96 lg:w-80 xl:w-96 h-full
      border-r border-gray-200 bg-white flex flex-col
      transition-transform duration-300 ease-in-out
    `}
      >
        {/* Header - Fixed */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chats</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        {/* Chat List - Independently Scrollable */}
        <div className="flex-1 overflow-y-auto h-full">
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat === chat.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <Badge
                    variant="default"
                    className="bg-blue-500 text-white text-xs flex-shrink-0"
                  >
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area - SCROLLABLE */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {selectedChat ? (
          <>
            {/* Chat Header - FIXED */}
            <div className="h-16 px-4 lg:px-6 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden flex-shrink-0"
                  onClick={toggleSidebar}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <div className="relative flex-shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedChatData?.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {selectedChatData?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedChatData?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium truncate">
                    {selectedChatData?.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedChatData?.isOnline
                      ? "Online"
                      : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area - SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {renderMessageContent(msg)}
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input - FIXED */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0 relative">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                </div>
                <div className="flex-1 relative">
                  <Input
                    ref={messageInputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="pr-12"
                  />
                  <Button
                    ref={emojiButtonRef}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() && selectedFiles.length === 0}
                  className="bg-blue-500 hover:bg-blue-600 flex-shrink-0"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Emoji Picker - Positioned absolutely relative to the message input container */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-4 mb-2 z-50"
                  style={{
                    transform: "translateY(-8px)",
                  }}
                >
                  <EmojiPicker
                    onEmojiSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <Button
                variant="ghost"
                className="lg:hidden mb-4"
                onClick={toggleSidebar}
              >
                <Menu className="w-6 h-6 mr-2" />
                Open Chats
              </Button>
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Welcome to Pulse
              </h3>
              <p className="text-gray-500 text-center">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {showFilePreview && (
        <FilePreview
          files={selectedFiles}
          onClose={() => {
            setShowFilePreview(false)
            setSelectedFiles([])
          }}
          onSend={handleSendMessage}
          message={message}
          onMessageChange={setMessage}
        />
      )}
    </div>
  )
}
