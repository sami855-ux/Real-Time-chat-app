import { axiosInstance } from "./userApi"

export const fetchMessages = async (conversationId) => {
  try {
    const res = await axiosInstance.get(
      `/message/conversation/${conversationId}`
    )

    if (res.data.success) {
      return {
        success: true,
        data: res.data.messages,
      }
    } else {
      return {
        success: false,
        message: res.data.message,
      }
    }
  } catch (error) {
    console.log("Error fetching messages:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch messages",
    }
  }
}

export const sendMessage = async (reciverId, formData) => {
  try {
    const res = await axiosInstance.post(
      `/message/sender/${reciverId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    if (res.data.success) {
      return {
        success: true,
        data: res.data.message,
      }
    } else {
      return {
        success: false,
        message: res.data.message,
      }
    }
  } catch (error) {
    console.log("Error sending message:", error)

    return {
      success: false,
      message: error.response?.data?.message || "Failed to send message",
    }
  }
}

export const fetchMessagedUsers = async () => {
  try {
    const response = await axiosInstance.get("/message/conversation")

    if (!response.data || !response.data.result) {
      throw new Error("Invalid response structure from server")
    }

    return response.data.result
  } catch (error) {
    console.log("Error fetched messages", error)

    return []
  }
}

export const makeMessagesRead = async (conversationId) => {
  try {
    const res = await axiosInstance.put(`/message/read/${conversationId}`)

    console.log(res)
    if (res.data.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Error making messaged read", error)
    return false
  }
}
