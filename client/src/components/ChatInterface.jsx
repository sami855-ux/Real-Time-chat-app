import { useState, useRef, useEffect } from "react";
import {
  Send,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Zap,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FilePreview from "./FilePreview";
import EmojiPicker from "./EmojiPicker";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/store/user";
import ChatComponent from "./ChatSection";
import { setLocalStorageItem } from "@/lib/utils";
import UserProfileDialog from "./UserDialog";

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(() => {
    const saved = localStorage.getItem("selectedChat");
    return saved !== null ? JSON.parse(saved) : "";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChatData, setSelectedChatData] = useState(() => {
    const saved = localStorage.getItem("selectedUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  //For sending a message
  const [message, setMessage] = useState("");
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const dispatch = useDispatch();
  const { users, selectedUser } = useSelector((state) => state.user);

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
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    setSelectedChatData(selectedUser);
  }, [selectedUser]);

  const handleSendMessage = () => {
    if ((message.trim() || selectedFiles.length > 0) && selectedChat) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: "user",
        timestamp: new Date(),
        files: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
      };
      setMessage("");
      setSelectedFiles([]);
      setShowFilePreview(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileObjects = files.map((file) => ({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setSelectedFiles(fileObjects);
      setShowFilePreview(true);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const input = messageInputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);

      // Set cursor position after emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.length;
        input.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  // const selectedChatData = selectedUser;

  //Fetch user messages based on selected chat conversationId => selectedChat

  const handleChatSelect = (conversationId, userId) => {
    const user = users.find((user) => user?.user?._id === userId);
    setLocalStorageItem("selectedUser", user.user);
    dispatch(setSelectedUser(user.user));

    setSelectedChat(conversationId);
    setLocalStorageItem("selectedChat", conversationId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="flex w-full h-[87vh] relative overflow-hidden">
        <Sidebar
          onChatSelect={handleChatSelect}
          selectedChat={selectedChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {/* Main Chat Area - SCROLLABLE */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative">
          {selectedChat ? (
            <>
              {/* Chat Header - FIXED */}
              <div className="h-20 px-6 border-b border-amber-200/60 bg-gradient-to-r from-white to-amber-50/30 flex items-center justify-between backdrop-blur-sm flex-shrink-0 ">
                <div className="flex items-center gap-4 min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden flex-shrink-0 h-10 w-10 p-0 bg-white/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200"
                    onClick={toggleSidebar}
                  >
                    <Menu className="w-4 h-4 text-amber-600" />
                  </Button>

                  <div className="relative flex-shrink-0">
                    <Avatar className="w-14 h-14 ring-2 ring-white shadow-lg">
                      <AvatarImage
                        src={selectedChatData?.profilePic || "/placeholder.svg"}
                        className="object-cover cursor-pointer"
                        onClick={() => setIsProfileOpen(true)}
                      />
                      <AvatarFallback className="uppercase bg-gradient-to-br from-amber-500 to-orange-500 text-white font-semibold text-sm">
                        {selectedChatData?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChatData?.isOnline ? (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                    ) : (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full shadow-sm"></div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="font-bold text-gray-900 truncate capitalize text-lg font-sans">
                      {selectedChatData?.fullName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-amber-600 font-medium truncate font-sans">
                        {selectedChatData?.isOnline
                          ? "Online now"
                          : "Last seen recently"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex h-10 w-10 p-0 bg-white/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 group"
                  >
                    <Phone className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex h-10 w-10 p-0 bg-white/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 group"
                  >
                    <Video className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 bg-white/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 group"
                  >
                    <MoreVertical className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Messages Area - SCROLLABLE */}

              <ChatComponent conversationId={selectedChat} />

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
              setShowFilePreview(false);
              setSelectedFiles([]);
            }}
            onSend={handleSendMessage}
            message={message}
            onMessageChange={setMessage}
          />
        )}
      </div>
      <UserProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />
    </>
  );
}
