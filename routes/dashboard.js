const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');
const User = require("../models/user");
const fetchFurther = require("../utils/fetchFurther");

router.get("/info", APIAuth, async (req, res) => {
  const user = await User.findById(req.user_id);
  console.log(user.profilePicture);
  return res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    courses: (await fetchFurther("Course", user.courses, ["code", "name", "description"])),
  });
});

router.delete("/delete", APIAuth, async (req, res) => {
  const user = await User.findByIdAndDelete(req.user_id);
  res.clearCookie("token");
  return res.status(200).json({
      message: "User deleted successfully!",
  });
});

router.put("/update", APIAuth, async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.user_id);
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;

  await user.save();
  console.log(user);
  res.send("User updated successfully!");
});

router.get('/', ClientAuth, (req, res) => {
  return res.render('dashboard');
});

module.exports = router;
