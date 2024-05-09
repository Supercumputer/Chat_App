const Users = require("../models/userModel.js");
require('dotenv').config()
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");

const checkEmail = async (email) => {
  const check = await Users.findOne({ email });

  if (check) {
    return true;
  }

  return false;
};

const hashPassWord = (pass) => {
  const hash = bcrypt.hashSync(pass, salt);
  return hash;
};

const comparePassWord = (pass, hash) => {
  return bcrypt.compareSync(pass, hash);
};

const generateAccessToken = (data) => {
  let key = process.env.JWT_SERVICE;
  let token = null;
  try {
    token = jwt.sign(data, key, { expiresIn: "3d" });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const gennerateRefreshToken = (data) => {
  let key = process.env.JWT_SERVICE;
  let token = null;
  try {
    token = jwt.sign(data, key, { expiresIn: "7d" });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SERVICE;
  let decode = null;
  try {
    decode = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decode;
};

module.exports = {
  checkEmail,
  hashPassWord,
  comparePassWord,
  generateAccessToken,
  gennerateRefreshToken,
  verifyToken,
};
