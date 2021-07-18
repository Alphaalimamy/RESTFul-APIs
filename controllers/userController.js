const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// SIGNUP
exports.userSignup = async (req, res) => {
  User.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      return res
        .status(409)
        .json({ message: "The email address is already in use" });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            status: "Fail",
            message: err.message,
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            contact: req.body.contact,
            address: req.body.address,
          });

          user
            .save()
            .then((result) => {
              res.status(201).json({
                status: "User created",
                user,
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err.message,
              });
            });
        }
      });
    }
  });

  //   let hashedPassword = req.body.password;
  //   const salt = await bcrypt.genSalt(20);
  //   hashedPassword = await bcrypt.hash(hashedPassword, salt);
  //   let user = new User({
  //     _id: new mongoose.Types.ObjectId(),
  //     email: req.body.email,
  //     password: hashedPassword,
  //     contact: req.body.contact,
  //     address: req.body.address,
  //   });
  //   user = await user.save();
  //   res.status(201).json({
  //     status: "success",
  //     user,
  //   });
};

// USER LOGIN
exports.userLogin = async (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authentication failed",
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authentication failed",
          });
        }

        if (result) {
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Authentication successful",
            token: token,
          });
        }

        res.status(401).json({
          message: "Authentication failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  //   User.remove({ _id: req.params.id })
  //     .exec()
  //     .then((result) => {
  //       res.status(200).json({ status: "Success", message: "User deleted" });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });

  // METHOD 2
  try {
    const user = await User.findByIdAndDelete(req.params.userId, req.body);
    if (user.length >= 1) {
      res.status(200).json({ status: "success", message: "user deleted" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: "User is not found" });
  }
};
