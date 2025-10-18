import { useSelector } from "react-redux";
import { useMessages } from "@/hook/GetMessages";
import { useEffect, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChatComponent({ conversationId }) {
  const { user } = useSelector((state) => state.auth);
  const { messages, setMessages, loading, refetch, isError } =
    useMessages(conversationId);
  const messagesEndRef = useRef(null);

  const renderMessageContent = (msg) => {
    return (
      <div className="break-words">
        {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessageAction = (action, message) => {
    console.log(`${action} message:`, message);

    switch (action) {
      case "reply":
        // Handle reply logic
        break;
      case "copy":
        navigator.clipboard.writeText(message.text);
        break;
      case "delete":
        // Handle delete logic
        break;
      case "forward":
        // Handle forward logic
        break;
      case "edit":
        // Handle edit logic
        break;
      case "pin":
        // Handle pin logic
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-amber-50/30 to-orange-50/20">
      {/* Centered Loading Animation */}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin"></div>
              <div className="absolute inset-0 m-auto w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <p className="text-amber-700 font-medium">Loading messages...</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages List */}
      {!loading && messages?.data?.length > 0 && (
        <div className="space-y-4">
          {messages.data.map((msg, index) => {
            const isSender = msg.senderId._id === user._id;
            const showAvatar =
              index === 0 ||
              messages.data[index - 1]?.senderId._id !== msg.senderId._id;

            return (
              <ContextMenu key={msg._id}>
                <ContextMenuTrigger asChild>
                  <div
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    } group relative`}
                  >
                    <div
                      className={`flex gap-3 max-w-[85%] ${
                        isSender ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`relative px-4 py-3  transition-all duration-300 transform hover:scale-[1.02] ${
                          isSender
                            ? "bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-md rounded-l-2xl rounded-tr-2xl"
                            : "bg-white text-gray-900 border border-amber-100 shadow-sm hover:shadow-md rounded-r-2xl rounded-tl-2xl"
                        } animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {renderMessageContent(msg)}

                        {/* Message Time */}
                        <div
                          className={`flex items-center justify-end gap-2 mt-2 ${
                            isSender ? "text-amber-100" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          {/* Read Receipt */}
                          {isSender && (
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  msg.read ? "bg-blue-400" : "bg-amber-200"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-amber-200">
                  {/* Actions available for both sender and receiver */}
                  {!isSender && (
                    <ContextMenuItem
                      onClick={() => handleMessageAction("reply", msg)}
                      className="flex items-center gap-3 cursor-pointer focus:bg-amber-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      Reply
                    </ContextMenuItem>
                  )}

                  <ContextMenuItem
                    onClick={() => handleMessageAction("copy", msg)}
                    className="flex items-center gap-3 cursor-pointer focus:bg-amber-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Text
                  </ContextMenuItem>

                  <ContextMenuItem
                    onClick={() => handleMessageAction("forward", msg)}
                    className="flex items-center gap-3 cursor-pointer focus:bg-amber-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Forward
                  </ContextMenuItem>

                  <ContextMenuItem
                    onClick={() => handleMessageAction("pin", msg)}
                    className="flex items-center gap-3 cursor-pointer focus:bg-amber-50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Pin Message
                  </ContextMenuItem>

                  {/* Actions available only for sender */}
                  {isSender && (
                    <>
                      <ContextMenuItem
                        onClick={() => handleMessageAction("edit", msg)}
                        className="flex items-center gap-3 cursor-pointer focus:bg-amber-50"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </ContextMenuItem>
                    </>
                  )}
                  <div className="border-t border-amber-100 my-1"></div>

                  <ContextMenuItem
                    onClick={() => handleMessageAction("delete", msg)}
                    className="flex items-center gap-3 cursor-pointer focus:bg-red-50 text-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Empty State */}
      {!loading && (!messages?.data || messages.data.length === 0) && (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <div className="text-center space-y-6 max-w-md">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg
                  className="w-10 h-10 text-amber-500 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 right-36">
                <Badge className="bg-amber-500 text-white animate-bounce">
                  New
                </Badge>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Start the Conversation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Send the first message to get things started! Ask a question,
                share an idea, or just say hello.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
