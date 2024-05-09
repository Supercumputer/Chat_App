const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/jwtAction.js");
const conversation = require("../controllers/conversatioController.js");
const fileUploader = require("../config/cloudinary.config");

router.post("/createconversation", checkToken, conversation.createConversation);
router.post(
  "/creategroupconversation",
  checkToken,
  fileUploader.single("image"),
  conversation.createConversationGroup
);
router.get("/getconversation/:id", checkToken, conversation.getConversationById);
router.get("/getallconversation", checkToken, conversation.getAllConversations);
router.delete("/deleteconversation/:id", checkToken, conversation.deleteConversations);

module.exports = router;
