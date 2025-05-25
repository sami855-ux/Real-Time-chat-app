import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon, Loader, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { GoogleIcon } from "./GoogleIcon"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { signUpUser } from "@/service/userApi"
import toast from "react-hot-toast"

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" })
  const [isRegistering, setIsRegistering] = useState(false)

  const onSubmit = async (data) => {
    try {
      setIsRegistering(true)

      const res = await signUpUser(data)

      if (res.success) {
        toast.success("Registration successful! Redirecting to home...")
        setTimeout(() => {
          window.location.href = "/home"
        }, 1000)
        reset()
      } else {
        toast.error(res.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Registration failed. Please try again."
      )
    } finally {
      setIsRegistering(false)
    }
  }
  return (
    <div className="w-full max-h-screen ">
      {/* Header */}
      <header className="h-16 px-12 w-full bg-white border-b border-gray-200 flex gap-2 items-center">
        <Zap
          className="w-6 h-6 text-black animate-pulse"
          fill="black"
          strokeWidth={1.5}
        />
        <h1 className="text-2xl font-bold">Pulse </h1>
      </header>

      {/* Main Content */}
      <main className="flex items-center pt-8 h-[calc(100vh-64px)] flex-col gap-2 px-4">
        <h2 className="text-4xl font-semibold">Create an account</h2>
        <h2 className="text-neutral-400 text-sm font-medium mt-1">
          Connect with friends in real-time.
        </h2>
        <section className="flex flex-col gap-4 mt-4 w-full max-w-lg">
          <form
            className="flex flex-col gap-4 w-full max-w-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Full Name */}
            <div className="grid w-full max-w-lg items-center gap-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                placeholder="Full Name"
                className="border focus:border-gray-400"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 6,
                    message: "Full name must be at least 6 characters long",
                  },
                })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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

            <div className="grid w-full max-w-lg items-center gap-1.5 mt-4">
              {!isRegistering ? (
                <Button type="submit" className="cursor-pointer">
                  Sign up
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="cursor-pointer bg-gray-900 cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <Loader className="animate-spin" size={16} /> Signing up...
                  </span>
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-neutral-500 text-sm mt-4 mb-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
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
