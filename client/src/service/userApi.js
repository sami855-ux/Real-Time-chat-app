import axios from "axios"

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true, // Include credentials for CORS requests
})

export const signUpUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", userData)
    return response.data
  } catch (error) {
    console.error("Error signing up user:", error)
    throw error
  }
}

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData)
    return response.data
  } catch (error) {
    console.error("Error logging in user:", error)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout")
    return response.data
  } catch (error) {
    console.error("Error logging out user:", error)
    throw error
  }
}
