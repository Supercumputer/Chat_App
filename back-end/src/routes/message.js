const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/jwtAction.js");
const message = require("../controllers/messagerController.js");
const fileUploader = require("../config/cloudinary.config");

router.post("/createmessage", checkToken, fileUploader.array('images', 10), message.createMessage);
router.get("/getmess/:id", checkToken, message.getMessageById);
router.delete("/deletemessage", checkToken, message.deleteMessages);

module.exports = router;
