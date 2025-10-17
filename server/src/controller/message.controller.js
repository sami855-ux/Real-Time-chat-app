import cloudinary from "../lib/cloudniary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

/**
 * Create or get an existing two-way conversation
 */
export const getOrCreateConversation = async (req, res) => {
  try {
    const userId = "68efcab55e633a6e4a70ffa4";

    const { receiverId } = req.params;

    if (!receiverId) {
      return res
        .status(400)
        .json({ message: "receiverId is required", success: false });
    }

    // Check if a conversation already exists (in either direction)
    let conversation = await Conversation.findOne({
      $or: [
        { participant1: userId, participant2: receiverId },
        { participant1: receiverId, participant2: userId },
      ],
    })
      .populate("participant1 participant2", "fullName profilePic")
      .populate("lastMessage");

    // If not found, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participant1: userId,
        participant2: receiverId,
      });
      await conversation.save();
    }

    return res.status(200).json({
      conversation,
      message: "Conversation fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error creating/getting conversation:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      $or: [{ participant1: userId }, { participant2: userId }],
    })
      .populate("participant1 participant2", "fullName profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Map to include only the "other" user
    const result = conversations.map((conv) => {
      const otherUser =
        conv.participant1._id.toString() === userId.toString()
          ? conv.participant2
          : conv.participant1;
      return {
        conversationId: conv._id,
        user: otherUser,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt,
      };
    });

    res
      .status(200)
      .json({ result, message: "Conversations fetched successfully" });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Send a new message (auto-creates conversation if not found)
 */
// export const sendMessage = async (req, res) => {
//   try {
//     const senderId = req.user._id;
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;

//     if (!receiverId || (!text && !image)) {
//       return res.status(400).json({ message: "Invalid message data" });
//     }

//     let imageUrl;

//     if (image) {
//       const cloudResponse = await cloudinary.uploader.upload(image, {
//         folder: "messages",
//       });
//       imageUrl = cloudResponse.secure_url;
//     }

//     // Find or create a conversation
//     let conversation = await Conversation.findOne({
//       $or: [
//         { participant1: senderId, participant2: receiverId },
//         { participant1: receiverId, participant2: senderId },
//       ],
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participant1: senderId,
//         participant2: receiverId,
//       });
//     }

//     // Create message
//     const message = new Message({
//       conversationId: conversation._id,
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl,
//     });
//     await message.save();

//     // Update conversation last message
//     conversation.lastMessage = message._id;
//     await conversation.save();

//     res.status(201).json({
//       data: message,
//       message: "Message sent successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ message: "Internal server error", success: false });
//   }
// };

export const sendMessage = async (req, res) => {
  try {
    const senderId = "68efcab55e633a6e4a70ffa4";
    const { id: receiverId } = req.params;
    const { text, image } = req.body;

    // Find or create a conversation
    let conversation = await Conversation.findOne({
      $or: [
        { participant1: senderId, participant2: receiverId },
        { participant1: receiverId, participant2: senderId },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participant1: senderId,
        participant2: receiverId,
      });
    }

    // Create message
    const message = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
      // image, // directly from body
    });

    await message.save();

    // Update conversation last message
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      data: message,
      message: "Message sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
/**
 * Get all messages in a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic")
      .sort({ createdAt: 1 }); // oldest first

    res.status(200).json({
      messages,
      message: "Messages fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
