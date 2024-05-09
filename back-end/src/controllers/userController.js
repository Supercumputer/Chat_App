const Users = require("../models/userModel.js");
require("dotenv").config();
const {
  comparePassWord,
  checkEmail,
  hashPassWord,
  generateAccessToken,
  gennerateRefreshToken,
} = require("../services/authService.js");

const createUser = async (req, res) => {
  try {
    const { fullName, email, passWord } = req.body;
    if (!fullName || !email || !passWord)
      return res
        .status(400)
        .json({ status: false, message: "Input is Missing !!!" });

    let check = await checkEmail(email);

    if (check) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newPassWord = hashPassWord(passWord);

    const newUser = await Users.create({ ...req.body, passWord: newPassWord });

    if (newUser) {
      return res.status(201).json({
        status: true,
        message: "Create user succsess !!!",
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "Create user faild !!!",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res
        .status(400)
        .json({ status: false, message: "Input is missing !!!" });

    const data = await Users.findById({ _id: id });

    return res.status(200).json({
      status: true,
      data,
      message: "Get user success !!!",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const data = await Users.find();
    return res.status(200).json({
      status: true,
      data,
      message: "Get all user success !!!",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, passWord } = req.body;
    if (!email || !passWord)
      return res
        .status(400)
        .json({ status: false, message: "Input is Missing !!!" });

    const user = await Users.findOne({ email: email });

    if (user) {
      const checkPass = comparePassWord(passWord, user.passWord);
      if (checkPass) {
        const { passWord, ...userData } = user.toObject();

        const payLoad = {
          id: userData._id,
        };

        const accessToken = generateAccessToken(payLoad);
        const refreshToken = gennerateRefreshToken(payLoad);

        res.cookie("JWT", refreshToken, {
          maxAge: process.env.JWT_EXPIRESIN,
          httpOnly: true,
        });

        await Users.findByIdAndUpdate(
          { _id: userData._id },
          { refreshToken },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          message: "Login success !!!",
          userData,
          accessToken,
        });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "Email or passWord not true" });
      }
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Email or passWord not true" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie && !cookie.JWT) {
      return res.status(400).json({
        message: "No refresh token in cookie.",
      });
    }

    await Users.updateOne(
      { refreshToken: cookie.JWT },
      { refreshToken: "" },
      { new: true }
    );

    res.clearCookie("JWT", { httpOnly: true, secure: true });
    return res.status(200).json({
      message: "Logout success",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAcount = async (req, res, next) => {
  try {
    const { id } = req.user;
    const userData = await Users.findById({ _id: id }).select(
      "-passWord -refreshToken"
    );

    return res.status(200).json({
      status: true,
      userData,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const searchUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { key } = req.query;
    const users = await Users.find({
      $or: [
        { fullName: { $regex: new RegExp(key, "i") } },
        { userName: { $regex: new RegExp(key, "i") } },
      ],
    });
    const newData = users.filter((item) => item._id.toString() !== id);

    res.status(200).json({
      status: true,
      newData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUser,
  getAllUser,
  login,
  logout,
  getAcount,
  searchUser,
};
