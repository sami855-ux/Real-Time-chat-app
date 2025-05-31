import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon, Loader, Zap } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleIcon } from "@/components/GoogleIcon"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { loginUser } from "@/service/userApi"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { checkAuth } from "@/store/auth"

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const res = await loginUser(data)

      if (res.success) {
        dispatch(checkAuth())
        toast.success("Login successful! Redirecting to home...")
        setTimeout(() => {
          navigate("/home")
        }, 1000)

        reset()
      } else {
        toast.error(res.message || "Login failed. Please try again.")
      }
    } catch (error) {
      console.error("Error during form submission:", error)
      toast.error(
        error.response.data.message || "Login failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/home")
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="w-full h-screen ">
      {/* Main Content */}
      <main className="flex items-center pt-20 h-screen flex-col gap-2 px-4">
        <h2 className="text-4xl font-semibold">Welcome back</h2>
        <h2 className="text-neutral-400 text-sm font-medium mt-1">
          Connect with friends in real-time.
        </h2>
        <section className="flex flex-col gap-4 mt-4 w-full max-w-lg">
          <form
            className="flex flex-col gap-4 w-full max-w-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                className="border focus:border-gray-400"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                className="border focus:border-gray-400"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <p className=" text-neutral-500 text-sm mt-1">
              Forgot password?{" "}
              <Link to="/" className="text-blue-500 hover:underline">
                Reset it
              </Link>
            </p>
            <div className="grid w-full max-w-lg items-center gap-1.5 mt-4">
              {isLoading ? (
                <Button
                  type="submit"
                  className="cursor-pointer bg-gray-900 cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <Loader className="animate-spin" size={16} /> Signing in...
                  </span>
                </Button>
              ) : (
                <Button type="submit" className="cursor-pointer">
                  Sign in
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-neutral-500 text-sm mt-4 mb-2">
            Don't have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="relative ">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 gap-2 transition-all hover:bg-gray-50 cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" /> Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 transition-all hover:bg-gray-50 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" /> GitHub
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
