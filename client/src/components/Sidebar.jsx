import { useState } from "react";
import { Button } from "./ui/button";
import { Loader, MoreVertical, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

export default function Sidebar({
  onChatSelect,
  selectedChat,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const { users, isLoading } = useSelector((store) => store.user);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter((user) =>
    user?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative fixed left-0 top-0 z-50
          w-80 sm:w-96 lg:w-80 xl:w-96 h-full
          border-r border-gray-200 bg-white flex flex-col
          transition-transform duration-300 ease-in-out
        `}
      >
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
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <Loader className="w-12 h-12 animate-spin text-blue-500" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading conversations...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto h-full">
            <div className="p-2">
              {filteredUsers?.length > 0 ? (
                filteredUsers?.map((user) => (
                  <div
                    key={user?._id}
                    onClick={() => {
                      onChatSelect(user?._id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedChat === user?._id
                        ? "bg-blue-100 border border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={user?.profilePic || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {user?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate capitalize">
                          {user.fullName}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTime(new Date(user.updatedAt))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {user?.lastMessage}
                      </p>
                    </div>
                    {2 > 0 && (
                      <Badge
                        variant="default"
                        className="bg-blue-500 text-white text-xs flex-shrink-0"
                      >
                        {2}
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center p-4">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    {searchTerm ? "No matches found" : "No conversations"}
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {searchTerm
                      ? "Try a different search term"
                      : "Start a new conversation"}
                  </p>
                  {!searchTerm && (
                    <Button className="mt-4" variant="outline">
                      New Chat
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
