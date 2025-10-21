import axios from "axios"

export const axiosInstance = axios.create({
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

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(
      "/auth/update-profile",
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}

export const getUser = async (searchQuery) => {
  try {
    const res = await axiosInstance.get(
      `/auth/user/searched?search=${searchQuery}`
    )

    if (res.data.success) {
      return res.data.users
    } else {
      return {}
    }
  } catch (error) {
    console.log("Error fetching user by ID:", error)

    return {}
  }
}
