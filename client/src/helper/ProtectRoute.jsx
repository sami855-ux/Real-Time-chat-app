import { useEffect } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function ProtectRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error("You need to be logged in to access this page.")
      navigate("/login")
    }
  }, [navigate])

  if (!isAuthenticated || !user) {
    return null
  }

  return <>{children}</>
}
