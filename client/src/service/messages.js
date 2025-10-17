import { axiosInstance } from "./userApi";

export const fetchMessages = async (conversationId) => {
  try {
    const res = await axiosInstance.get(
      `/message/conversation/${conversationId}`
    );

    if (res.data.success) {
      return {
        success: true,
        data: res.data.messages,
      };
    } else {
      return {
        success: false,
        message: res.data.message,
      };
    }
  } catch (error) {
    console.log("Error fetching messages:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch messages",
    };
  }
};
