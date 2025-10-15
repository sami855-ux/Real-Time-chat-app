import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./page/Register";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import Home from "./page/Home";
import Profile from "./page/Profile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth";
import { Loader2 } from "lucide-react";
import ProtectRoute from "./helper/ProtectRoute";
import { ThemeProvider } from "./helper/ThemeProvider";
import Setting from "./page/Setting";

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
    element: (
      <ProtectRoute>
        {" "}
        <Home />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/setting",
    element: <Setting />,
  },
]);

function App() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgb(27, 27, 28)",
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
    </ThemeProvider>
  );
}

export default App;
