const mongoose = require("mongoose");
var mongooseDelete = require("mongoose-delete");
const Schema = mongoose.Schema;

const conversation = new Schema(
  {
    type: { type: String, enum: ["private", "group"], default: "private" },
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    name: { type: String, default: "" },
    avatar: { type: String, default: "" },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);
conversation.plugin(mongooseDelete, {deletedAt: true, overrideMethods: 'all'});
module.exports = mongoose.model("Conversation", conversation);
