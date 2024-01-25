const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

router.get("/info", APIAuth, async (req, res) => {
  try {
    const user = await req.db.user_table.findOne("email", req.user_email);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist!" });
    }
    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: "An unexpected error occured!" });
  }
});

router.delete("/delete", APIAuth, async (req, res) => {
  try {
    await req.db.user_table.deleteOne("email", req.user_email);
    res.clearCookie("token");
    return res.status(200).json({
        message: "User deleted successfully!",
    });
  } catch (err) {
    return res.status(500).json({ message: "An unexpected error occured!" });
  }
});

router.put("/update", APIAuth, async (req, res) => {
  try {
    await req.db.user_table.updateOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }, "email", req.user_email);

    res.send("User updated successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while updating the user.");
  }
});

router.get('/', ClientAuth, (req, res) => {
  return res.render('dashboard');
});

module.exports = router;