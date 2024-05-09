const Conversation = require("../models/conversations");

// Lấy tất cả cuộc trò chuyện
const getAllConversations = async (req, res) => {
  try {
    const { id, type } = req.query;
    
    const obj = {
      participants: { $in: [id] },
    };

    if (type == "groups") {
      obj["type"] = "group";
    }else if(type == "private"){
      obj["type"] = "private"
    }

    const conversations = await Conversation.find(obj)
      .populate({
        path: "participants",
        select: "-passWord -refreshToken",
      })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ status: true, conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo một cuộc trò chuyện mới
const createConversation = async (req, res) => {
  try {
    const { to, type = "private" } = req.body;
    // Kiểm tra xem cuộc trò chuyện giữa người dùng đang đăng nhập và người dùng được chọn đã tồn tại chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, to] },
      type: type,
    });

    if (!conversation) {
      // Nếu cuộc trò chuyện chưa tồn tại, tạo mới cuộc trò chuyện
      conversation = new Conversation({
        participants: [req.user.id, to],
        type: type,
      });

      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConversationGroup = async (req, res) => {
  try {
    const { type = "group", name } = req.body;
    console.log(req.body);
    const pathImg = req.file && req.file.path;

    const conversation = new Conversation({
      type: type,
      participants: [req.user.id, ...req.body.userId.split(",")],
      name,
      avatar: pathImg,
    });

    await conversation.save();

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin của một cuộc trò chuyện dựa trên ID
const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate({
      path: "participants",
      select: "-passWord -refreshToken",
    });

    if (conversation) {
      res.status(200).json({ status: true, conversation });
    } else {
      res.status(404).json({ status: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa một cuộc trò chuyện dựa trên ID
const deleteConversations = async (req, res) => {
  try {
    const conversation = await Conversation.delete({_id: req.params.id});
    if (conversation) {
      res.json({ message: "Conversation deleted" });
    } else {
      res.status(404).json({ message: "Conversation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllConversations,
  createConversation,
  getConversationById,
  deleteConversations,
  createConversationGroup,
};
