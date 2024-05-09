const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongooseDelete = require("mongoose-delete");

const message = new Schema(
  {
    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: "Conversation",
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    content: { type: String },
    type: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
  },
  {
    timestamps: true,
  }
);

message.plugin(mongooseDelete, {deletedAt: true, overrideMethods: 'all'});
module.exports = mongoose.model("Message", message);

