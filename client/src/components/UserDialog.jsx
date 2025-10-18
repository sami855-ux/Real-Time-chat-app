import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const UserProfileDialog = ({ isOpen, onClose, user }) => {
  // Mock user data
  const mockUser = {
    _id: "1",
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    profilePic: "/placeholder.svg",
    isOnline: true,
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
    bio: "Product designer & frontend developer. Love building beautiful user interfaces and experiences.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: new Date("2023-01-15"),
    status: "Available for freelance work",
    socialLinks: {
      twitter: "https://twitter.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      portfolio: "https://alexjohnson.design",
    },
    stats: {
      conversations: 24,
      mutualFriends: 8,
      commonGroups: 3,
    },
  };

  const userData = mockUser;

  //   const formatJoinDate = (date) => {
  //     return date.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     });
  //   };

  //   const formatLastSeen = (date) => {
  //     const now = new Date();
  //     const diffMs = now - date;
  //     const diffMins = Math.floor(diffMs / 60000);
  //     const diffHours = Math.floor(diffMs / 3600000);
  //     const diffDays = Math.floor(diffMs / 86400000);

  //     if (diffMins < 1) return "Just now";
  //     if (diffMins < 60) return `${diffMins} minutes ago`;
  //     if (diffHours < 24) return `${diffHours} hours ago`;
  //     if (diffDays < 7) return `${diffDays} days ago`;
  //     return formatJoinDate(date);
  //   };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg bg-white/95 backdrop-blur-sm border-amber-200 rounded-2xl shadow-xl">
        <div className="space-y-6 py-4">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-amber-100 shadow-lg">
                <AvatarImage
                  src={userData.profilePic}
                  alt={userData.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xl font-bold uppercase">
                  {userData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 border-2 border-white rounded-full ${
                  userData.isOnline ? "bg-green-500" : "bg-amber-400"
                }`}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {userData.fullName}
                </h2>
                <Badge
                  variant={userData.isOnline ? "default" : "secondary"}
                  className={`${
                    userData.isOnline
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  {userData.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>

              <p className="text-amber-600 font-medium text-sm">
                {userData.status}
              </p>

              {!userData.isOnline && (
                <p className="text-gray-500 text-sm">
                  {/* Last seen {formatLastSeen(userData.lastSeen)} */}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-amber-100" />

          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Bio
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {userData.bio}
            </p>
          </div>

          <Separator className="bg-amber-100" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Contact Information
            </h3>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">
                    {userData.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500">Member since</p>
                  <p className="text-gray-900 font-medium">
                    {/* {formatJoinDate(userData.joinDate)} */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-amber-100" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
