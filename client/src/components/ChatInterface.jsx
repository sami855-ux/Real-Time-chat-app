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
import { fetchMessagedUsers, setSelectedUser } from "@/store/user";
import ChatComponent from "./ChatSection";
import { setLocalStorageItem } from "@/lib/utils";
import UserProfileDialog from "./UserDialog";
import { sendMessage } from "@/service/messages";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatInterface() {
  const queryClient = useQueryClient();

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
  const [isSending, setIsSending] = useState(false);

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

  const handleSendMessage = async () => {
    if ((!message.trim() && selectedFiles.length === 0) || !selectedChatData)
      return;

    setIsSending(true);

    const formData = new FormData();

    if (message.trim()) {
      formData.append("text", message.trim());
    }

    console.log("Selected files to send:", selectedFiles);
    // Append each image file
    selectedFiles.forEach(({ file }) => {
      formData.append("images", file);
    });

    console.log("Sending message with data:", formData);

    try {
      const res = await sendMessage(selectedChatData._id, formData);

      if (res.success) {
        // Message sent successfully

        setMessage("");
        setSelectedFiles([]);
        setShowFilePreview(false);

        // Invalidate and refetch messages for the selected conversation
        queryClient.invalidateQueries(["messages", selectedChat]);

        dispatch(fetchMessagedUser());
      } else {
        console.error(
          "Failed to send message:",
          res.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
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
      <div className="flex w-full h-full relative overflow-hidden">
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
              <div className="h-20 px-6 border-b border-amber-200/40 bg-gradient-to-r from-background/50 via-background/40 to-amber-50/15 flex items-center justify-between backdrop-blur-lg flex-shrink-0 dark:bg-gradient-to-r dark:from-background/70 dark:via-background/50 dark:to-amber-950/5 dark:border-amber-800/20 shadow-lg shadow-amber-100/10 dark:shadow-amber-900/5 saturate-150">
                <div className="flex items-center gap-4 min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden flex-shrink-0 h-10 w-10 p-0 bg-background/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 dark:bg-background/80 dark:hover:bg-amber-900/50 dark:border-amber-800/30"
                    onClick={toggleSidebar}
                  >
                    <Menu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </Button>

                  <div className="relative flex-shrink-0">
                    <Avatar className="w-14 h-14 ring-2 ring-background shadow-lg">
                      <AvatarImage
                        src={selectedChatData?.profilePic || "/placeholder.svg"}
                        className="object-cover cursor-pointer"
                        onClick={() => setIsProfileOpen(true)}
                      />
                      <AvatarFallback className="uppercase bg-gradient-to-br from-amber-500 to-orange-500 text-primary-foreground font-semibold text-sm dark:from-amber-600 dark:to-orange-600">
                        {selectedChatData?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedChatData?.isOnline ? (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full shadow-sm animate-pulse"></div>
                    ) : (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 border-2 border-background rounded-full shadow-sm dark:bg-amber-500"></div>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="font-bold text-foreground truncate capitalize text-lg">
                      {selectedChatData?.fullName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-amber-600 font-medium truncate dark:text-amber-400">
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
                    className="hidden sm:flex h-10 w-10 p-0 bg-background/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 group dark:bg-background/80 dark:hover:bg-amber-900/50 dark:border-amber-800/30"
                  >
                    <Phone className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform dark:text-amber-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex h-10 w-10 p-0 bg-background/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 group dark:bg-background/80 dark:hover:bg-amber-900/50 dark:border-amber-800/30"
                  >
                    <Video className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform dark:text-amber-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 bg-background/80 hover:bg-amber-100/50 border border-amber-200/30 transition-all duration-200 group dark:bg-background/80 dark:hover:bg-amber-900/50 dark:border-amber-800/30"
                  >
                    <MoreVertical className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform dark:text-amber-400" />
                  </Button>
                </div>
              </div>

              {/* Messages Area - SCROLLABLE */}

              <ChatComponent conversationId={selectedChat} />

              {/* Message Input - FIXED */}
              <div className="p-6 border-t border-border/50 bg-background/95 backdrop-blur-sm flex-shrink-0 relative">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  {/* File Attachment */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 hover:bg-accent rounded-lg transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <Input
                      ref={messageInputRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="h-9 rounded-lg border-border bg-background focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 pr-8 text-sm font-geist placeholder:text-muted-foreground/60"
                    />
                    <Button
                      ref={emojiButtonRef}
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-accent rounded transition-colors"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>

                  {/* Send Button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      isSending ||
                      (!message.trim() && selectedFiles.length === 0)
                    }
                    className="h-9 px-3 flex-shrink-0 bg-black text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-geist text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400"
                    size="sm"
                  >
                    {isSending ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending</span>
                      </div>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full right-4 mb-2 z-50"
                  >
                    <div className="bg-popover border border-border rounded-lg shadow-xl">
                      <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        onClose={() => setShowEmojiPicker(false)}
                      />
                    </div>
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
