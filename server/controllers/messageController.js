import Message from "../models/Message.js";
import User from "../models/User.js";
import { uploadImage } from "../lib/cloudinary.js";
import { io, userSocketMap } from "../lib/socket.js";

// Sidebar: all other users + count of unseen messages from each
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};
    await Promise.all(
      users.map(async (u) => {
        const count = await Message.countDocuments({
          senderId: u._id,
          receiverId: userId,
          seen: false,
        });
        if (count > 0) unseenMessages[u._id] = count;
      })
    );

    res.json({ success: true, users, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Conversation with one user; also marks their messages as seen
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) return res.json({ success: false, message: "Empty message" });

    const imageUrl = image ? await uploadImage(image) : undefined;

    const newMessage = await Message.create({ senderId, receiverId, text, image: imageUrl });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
