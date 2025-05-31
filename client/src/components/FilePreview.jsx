"use client"
import { X, Send, File, ImageIcon, Video, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function FilePreview({
  files,
  onClose,
  onSend,
  message,
  onMessageChange,
}) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    )
  }

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-8 h-8" />
    if (type.startsWith("video/")) return <Video className="w-8 h-8" />
    if (type.startsWith("audio/")) return <Music className="w-8 h-8" />
    return <File className="w-8 h-8" />
  }

  const isImage = (type) => type.startsWith("image/")
  const isVideo = (type) => type.startsWith("video/")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            Send {files.length} {files.length === 1 ? "file" : "files"}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* File Preview Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {/* File Preview */}
                  <div className="flex-shrink-0">
                    {isImage(fileObj.type) ? (
                      <img
                        src={fileObj.url || "/placeholder.svg"}
                        alt={fileObj.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : isVideo(fileObj.type) ? (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center relative">
                        <Video className="w-8 h-8 text-gray-500" />
                        <video
                          src={fileObj.url}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-50"
                          muted
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(fileObj.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {fileObj.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(fileObj.size)} •{" "}
                      {fileObj.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </p>

                    {/* Large Preview for Images */}
                    {isImage(fileObj.type) && (
                      <div className="mt-3">
                        <img
                          src={fileObj.url || "/placeholder.svg"}
                          alt={fileObj.name}
                          className="max-w-full h-auto rounded-lg max-h-64 object-contain"
                        />
                      </div>
                    )}

                    {/* Video Preview */}
                    {isVideo(fileObj.type) && (
                      <div className="mt-3">
                        <video
                          src={fileObj.url}
                          controls
                          className="max-w-full h-auto rounded-lg max-h-64"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Caption Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Add a caption..."
              className="flex-1"
            />
            <Button onClick={onSend} className="bg-blue-500 hover:bg-blue-600">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
