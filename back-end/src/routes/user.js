const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/jwtAction.js");
const userController = require("../controllers/userController");

router.post("/createuser", userController.createUser);
router.get("/getuser", checkToken, userController.getUser);
router.post("/getalluser", checkToken, userController.getAllUser);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/searchuser", checkToken, userController.searchUser);
router.get("/getacount", checkToken, userController.getAcount);

module.exports = router;
