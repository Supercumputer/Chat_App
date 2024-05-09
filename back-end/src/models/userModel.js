const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    userName: { type: String, default: "" },
    fullName: { type: String, required: true },
    avatar: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    passWord: { type: String, required: true },
    refreshToken: { type: String, default: "" },
    friends: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    online: {type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", user);

