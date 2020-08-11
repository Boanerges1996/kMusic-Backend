const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const router = express.Router();

dotenv.config();

//Create Admin
router.post("/admin-new", async (req, res) => {
  if (
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    res.send({ message: "Please provide a body" });
  } else {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAdmin = new Admin({
        ...req.body,
        password: hashedPassword
      });
      const savedAdmin = await newAdmin.save();
      const auth_token = jwt.sign(
        { username: req.body.username },
        process.env.SECRET_KEY,
        { algorithm: "HS256" }
      );
      res
        .set({ auth_token })
        .status(200)
        .send({...savedAdmin._doc,logged:true});
    } catch (err) {
      res
        .status(400)
        .send({ ...err, message: "Account already exist", logged: false });
    }
  }
});

router.post("/admin-login", async (req, res) => {
  if (
    Object.entries(req.body).length === 0 &&
    req.body.constructor === Object
  ) {
    res.send({ message: "Please provide a body" });
  } else {
    try {
      let username = req.body.username;
      let password = req.body.password;
      const verifyUsername = await Admin.findOne({ username: username });
      if (verifyUsername) {
        const verifyPassword = await bcrypt.compare(
          password,
          verifyUsername.password
        );
        if (verifyPassword) {
          let auth_token = jwt.sign(
            { username: username },
            process.env.SECRET_KEY,
            { algorithm: "HS256" }
          );
          res
            .set({ auth_token })
            .send({ ...verifyUsername._doc, logged: true ,auth_token});
        } else {
          res.status(400).send({ message: "Invalid password", logged: false });
        }
      } else {
        res.status(404).send({ message: "Dont have an account" });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.get("/admin-info/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let verifyId = await Admin.findOne({ _id: id });
    if (verifyId) {
      res.send(verifyId);
    } else {
      res.status(400).send({ message: "This admins account doesn't exist" });
    }
  } catch (err) {
    res.status(400).send({ ...err, mess: "Account of this id is invalid" });
  }
});

module.exports = router;
