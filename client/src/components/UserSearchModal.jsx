// components/UserSearchModal.jsx
import { useEffect, useState, useCallback } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/service/userApi"
import { useDispatch } from "react-redux"
import { setSelectedUser } from "@/store/user"
import { setSelectedChatStore } from "@/store/message"

export default function UserSearchModal() {
  const dispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ✅ Debounce function to avoid API spam
  const debounce = (func, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => func(...args), delay)
    }
  }

  // ✅ Fetch users from backend based on search
  const fetchUsers = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setFilteredUsers([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const res = await getUser(query)
        console.log("res from getUser:")
        if (res) {
          setFilteredUsers(res)
        } else {
          setFilteredUsers([])
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to fetch users.")
        setFilteredUsers([])
      } finally {
        setLoading(false)
      }
    }, 400),
    []
  )

  useEffect(() => {
    fetchUsers(searchQuery)
  }, [searchQuery, fetchUsers])

  const handleInputFocus = () => {
    setIsModalOpen(true)
  }

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSearchQuery("")
    setFilteredUsers([])
    setError(null)
  }

  const handleUserSelect = (user) => {
    console.log("Selected user:", user)
    // Add your action here (open chat, navigate to profile, etc.)
    dispatch(setSelectedUser(user))
    dispatch(setSelectedChatStore("sam"))
    handleCloseModal()
  }

  return (
    <>
      {/* 🔍 Search Input (trigger modal) */}
      <div className="relative w-72 cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search new user..."
          className="pl-10 font-[13px] cursor-pointer"
          onFocus={handleInputFocus}
        />
      </div>

      {/* 💬 Search Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Search Users
              </DialogTitle>
            </div>

            {/* 🔎 Input inside modal */}
            <div className="relative w-full mt-2 cursor-pointer hover:bg-accent/50 rounded-md transition-colors">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10 font-[13px] cursor-pointer"
                autoFocus
              />
            </div>
          </DialogHeader>

          {/* 📜 Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-sm text-muted-foreground">
                <Search className="w-6 h-6 mb-2 animate-spin" />
                Searching...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : searchQuery.trim() ? (
              filteredUsers.length > 0 ? (
                <div className="p-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id || user.id}
                      onClick={() => handleUserSelect(user)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <Avatar className="w-10 h-10 border-2 border-background">
                        <AvatarImage
                          src={user.profilePic || "/placeholder.svg"}
                          alt={user.name || user.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold uppercase">
                          {(user.name || user.fullName || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate capitalize">
                            {user.name || user.fullName}
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
                    No users match "{searchQuery}". Try different terms.
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

          {/* 🦶 Footer */}
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
  )
}
