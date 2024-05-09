const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/chat");
    console.log("Connect database success !!!");
  } catch (error) {
    console.log("Connect database faild !!!");
  }
};

module.exports = connectDb;
