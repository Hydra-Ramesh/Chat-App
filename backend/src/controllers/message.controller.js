import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Get all users for the sidebar, excluding the logged-in user
export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // Exclude password field
    res.status(200).json(filterUsers);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error in Get User For Sidebar Controller");
  }
};

// Get messages between the logged-in user and a specific user
export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // The other user's ID
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by timestamp

    res.status(200).json(messages);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error in Get Message Controller");
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Message content
    const { id: receiverId } = req.params; // Receiver's user ID
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).send("Image upload failed");
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error in Send Message Controller");
  }
};
