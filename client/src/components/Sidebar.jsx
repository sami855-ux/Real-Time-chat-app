import { useState } from "react";
import { Button } from "./ui/button";
import { Loader, MoreVertical, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { timeElapsed } from "@/lib/utils";

export default function Sidebar({
  onChatSelect,
  selectedChat,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const { users, isLoading } = useSelector((store) => store.user);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter((user) =>
    user?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(users);

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
              className="pl-10 font-[13px"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
              <Loader className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">
              Loading conversations...
            </p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </div>
        ) : (
          /* Conversations List */
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              {filteredUsers?.length > 0 ? (
                filteredUsers?.map((user) => (
                  <div
                    key={user?.conversationId}
                    onClick={() => {
                      onChatSelect(user?.conversationId, user?.user?._id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      group flex items-center gap-4 p-4 cursor-pointer transition-all duration-200
                      rounded-xl mx-2 mb-2 border border-transparent
                      ${
                        selectedChat === user?.conversationId
                          ? "bg-gradient-to-r from-orange-200 to-amber-200 border-orange-200 shadow-sm"
                          : "hover:bg-gray-50/80 hover:border-gray-200/60"
                      }
                    `}
                  >
                    {/* Avatar with Online Indicator */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-14 h-14 ring-2 ring-white shadow-sm group-hover:ring-orange-100 transition-all">
                        <AvatarImage
                          src={user?.user?.profilePic || "/placeholder.svg"}
                          className="object-cover"
                        />
                        <AvatarFallback className="uppercase bg-gradient-to-br from-orange-500 to-amber-500 text-white font-semibold text-sm">
                          {user?.user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${
                          user?.isOnline ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate capitalize text-sm">
                          {user?.user?.fullName}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {timeElapsed(user?.updatedAt)}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-600 truncate opacity-90">
                        {"Start a conversation..."}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {2 > 0 && (
                      <Badge className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold px-2 py-1 min-w-[1.5rem] h-6 rounded-full shadow-sm">
                        {2}
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {searchTerm ? "No matches found" : "No conversations yet"}
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start chatting with your contacts to see conversations here"}
                  </p>
                  {!searchTerm && (
                    <Button className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm transition-all duration-200">
                      Start New Chat
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
