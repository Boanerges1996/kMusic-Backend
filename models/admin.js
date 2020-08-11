const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, "Account already exists"]
  },
  username: {
    type: String,
    unique: [true, "Account already exist"]
  },
  password: {
    type: { String },
    min: 4,
    max: 1024
  },
  isAdmin: {
    type: Boolean,
    default: true
  },
  url: {
    type: String,
    default: "https://image.flaticon.com/icons/png/512/126/126486.png"
  }
});

module.exports = mongoose.model("admin", Admin);
