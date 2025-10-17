import { useSelector } from "react-redux";
import { useMessages } from "@/hook/GetMessages";
import { useEffect, useRef } from "react";

export default function ChatComponent({ conversationId }) {
  const { user } = useSelector((state) => state.auth);
  const { messages, setMessages, loading, refetch, isError } =
    useMessages(conversationId);

  const messagesEndRef = useRef(null);

  const renderMessageContent = (msg) => {
    return (
      <div>
        {/* {msg.images && msg.images.length > 0 && (
          <div className="mb-2">
            {msg.images.map((fileObj, index) => (
              <div key={index} className="mb-2">
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
        )} */}
        {msg.text && <p className="text-sm break-words">{msg.text}</p>}
      </div>
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4">
      <div className="space-y-4">
        {/* Loader */}
        {loading ? (
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-gray-500 text-sm">
                  Loading messages...
                </span>
              </div>
            </div>
          </div>
        ) : messages?.data?.length > 0 ? (
          messages.data.map((msg) => {
            const isSender = msg.senderId._id === user._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                    isSender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {renderMessageContent(msg)}
                  <p
                    className={`text-xs mt-1 ${
                      isSender ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              {/* Text */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start a conversation by sending the first message!
              </p>

              {/* Optional: Prompt to start chatting */}
              <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-700">
                  💡 <strong>Tip:</strong> Say hello or ask a question to get
                  the conversation started.
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
