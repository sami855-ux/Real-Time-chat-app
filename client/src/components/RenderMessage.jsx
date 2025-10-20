import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { ImageViewer } from "./ImageViewer.jsx";

export default function RenderMessageContent({ msg }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageViewer = (index) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  return (
    <>
      <div className="break-words">
        {/* Text content */}
        {msg.text && <p className="text-sm leading-relaxed mb-3">{msg.text}</p>}

        {/* Image gallery */}
        {msg.images && msg.images.length > 0 && (
          <div
            className={`grid gap-2 ${
              msg.images.length === 1
                ? "grid-cols-1 max-w-md"
                : msg.images.length === 2
                ? "grid-cols-2 max-w-lg"
                : msg.images.length === 3
                ? "grid-cols-2 max-w-md"
                : "grid-cols-2 max-w-lg"
            }`}
          >
            {msg.images.slice(0, 4).map((imageUrl, index) => (
              <div
                key={index}
                className={`relative group rounded-xl overflow-hidden bg-gray-100 cursor-pointer ${
                  msg.images.length === 3 && index === 0
                    ? "col-span-2 aspect-video"
                    : msg.images.length === 1
                    ? "aspect-video"
                    : "aspect-square"
                }`}
                onClick={() => openImageViewer(index)}
              >
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300" />
                </div>

                {/* Image counter for grids with more than 4 images */}
                {msg.images.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      +{msg.images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        images={msg.images}
        initialIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
}
