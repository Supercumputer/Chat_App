const Message = require("../models/messages");
const Conversation = require("../models/conversations");
const { io, getReceiverSocketId } = require("../socket/socket");

// Lấy tất cả các tin nhắn
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo một tin nhắn mới
const createMessage = async (req, res) => {
  try {
    const { id } = req.user;
    const { conversationId, senderId, content: title, type } = req.body;

    let content = title;
    if (type == "image") {
      req.files.forEach((item) => {
        content += `,${item.path}`;
      });
    }

    const message = new Message({
      conversationId,
      senderId,
      content,
      type,
    });

    const newMessage = await message.save();

    const inforDateUpdate = await Conversation.findByIdAndUpdate(
      { _id: conversationId },
      { lastMessage: newMessage._id }
    );

    const data = await Message.findWithDeleted({ conversationId }).populate({
      path: "senderId",
      select: "-passWord -refreshToken",
    });

    const ListUser = inforDateUpdate.participants.filter(
      (item) => item.toString() !== id
    );

    ListUser.forEach(async (receiverId) => {
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        // Sử dụng io.to(socket_id).emit() để gửi sự kiện tới từng client cụ thể
        io.to(receiverSocketId).emit("newMessage", data);
      }
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy thông tin của một tin nhắn dựa trên ID
const getMessageById = async (req, res) => {
  try {
    const data = await Message.findWithDeleted({ conversationId: req.params.id }).populate(
      {
        path: "senderId",
        select: "-passWord -refreshToken",
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật tin nhắn
const updateMessage = async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedMessage) {
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa tin nhắn
const deleteMessages = async (req, res) => {
  try {
    const {id, conversionid} = req.query
    
    const deletedMessage = await Message.delete({ _id: id });
    if (deletedMessage) {
      const data = await Message.findWithDeleted({ conversationId: conversionid }).populate(
        {
          path: "senderId",
          select: "-passWord -refreshToken",
        }
      );
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Message not found" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMessages,
  createMessage,
  getMessageById,
  updateMessage,
  deleteMessages,
};
