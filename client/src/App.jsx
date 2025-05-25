import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Register from "./page/Register"
import Login from "./page/Login"
import { Toaster } from "react-hot-toast"
import Home from "./page/Home"
import Profile from "./page/Profile"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(27, 27, 28, 0.86)",
            color: "#fff",
            borderRadius: "10px",
            border: "1px solid rgba(84, 84, 86, 0.86)",
            boxShadow: "0 4px 12px rgba(46, 45, 49, 0.86)",
            fontSize: "13px",
            padding: "10px 15px",
            fontWeight: "500",
            lineHeight: "1.5",
            textAlign: "center",
          },
          duration: 3000,
        }}
      />
    </>
  )
}

export default App
