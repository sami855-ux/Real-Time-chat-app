// components/UserSearchModal.jsx
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserSearchModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Replace with your actual users from Redux store or API
  const { users } = useSelector((state) => state.users || { users: [] });

  // Mock users data - replace with actual data
  const mockUsers = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      profilePic: "/placeholder.svg",
      isOnline: true,
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      profilePic: "/placeholder.svg",
      isOnline: false,
    },
    {
      id: 3,
      fullName: "Mike Johnson",
      email: "mike@example.com",
      profilePic: "/placeholder.svg",
      isOnline: true,
    },
  ];

  const allUsers = users.length > 0 ? users : mockUsers;

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allUsers.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, allUsers]);

  const handleInputFocus = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleUserSelect = (user) => {
    console.log("Selected user:", user);
    // Add your user selection logic here (start chat, navigate to profile, etc.)
    handleCloseModal();
  };

  return (
    <>
      {/* Search Input */}

      <div className="relative w-72 cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search new user..."
          className="pl-10 font-[13px] cursor-pointer "
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </div>
      {/* Search Results Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Search Users
              </DialogTitle>
            </div>

            {/* Search Input inside Modal */}
            <div className="flex items-center border border-input bg-background rounded-lg px-3 py-2 mt-4">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleInputChange}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-0 text-sm h-auto "
                autoFocus
              />
            </div>
          </DialogHeader>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery.trim() ? (
              filteredUsers.length > 0 ? (
                <div className="p-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src={user.profilePic}
                          alt={user.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold uppercase">
                          {user.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate capitalize">
                            {user.fullName}
                          </p>
                          {user.isOnline && (
                            <Badge
                              variant="secondary"
                              className="h-1.5 w-1.5 rounded-full p-0 bg-green-500 border-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Search className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">No users found</p>
                  <p className="text-xs text-muted-foreground">
                    No users match "{searchQuery}". Try searching with different
                    terms.
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">Search for users</p>
                <p className="text-xs text-muted-foreground">
                  Start typing to find users by name or email address
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-muted/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {searchQuery.trim() && filteredUsers.length > 0
                  ? `${filteredUsers.length} user${
                      filteredUsers.length > 1 ? "s" : ""
                    } found`
                  : "Search by name or email"}
              </p>
              {searchQuery.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-7 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
