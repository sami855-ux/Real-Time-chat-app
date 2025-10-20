import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FilePreview({
  files,
  onClose,
  onSend,
  message,
  onMessageChange,
}) {
  // Only include image files
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 overflow-auto">
      {/* Header with close button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-3 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Image Grid with enhanced styling */}
      <div className="w-full max-w-6xl mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Preview Images</h2>
          <p className="text-white/60">
            {imageFiles.length} image{imageFiles.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageFiles.map((fileObj) => (
            <div
              key={fileObj.id}
              className="relative group aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={fileObj.url || "/placeholder.svg"}
                alt={fileObj.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* File name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-medium truncate">
                  {fileObj.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption + Send with enhanced styling */}
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Add a captivating caption..."
              className="flex-1 border-0 bg-transparent text-white placeholder:text-white/60 focus:ring-0 text-lg py-6 px-4"
            />
            <Button
              onClick={onSend}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2 px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
              Send
            </Button>
          </div>
        </div>

        {/* Helper text */}
        <p className="text-center text-white/40 text-sm mt-3">
          Press Send to share these images with your caption
        </p>
      </div>
    </div>
  );
}
