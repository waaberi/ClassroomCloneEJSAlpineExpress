const express = require("express");
const multer = require('multer');
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwords = require("../utils/passwords");
const { ClientNoAuth } = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

// Authentication page
router.get("/", ClientNoAuth, (req, res) => res.render("auth"));

// Login route
router.post("/signin", upload.none(), async (req, res) => {
    let body = req.body;
    console.log(req.body)

    let user = await User.findOne({ email: body.email });
    if (!user) return res.status(404).json({ message: "User doesn't exist!" });

    const isMatch = await passwords.compare(body.password, user.password);

    if (!isMatch) return res.status(403).json({ message: "Incorrect password!" });

    let token = jwt.sign(
        { user_id: user._id },
        process.env.JWT_SECRET || process.env.JWT_SECRET_DEV
    );

    res.cookie("token", token); // Set the "token" cookie

    console.log(token);

    return res.status(200).send({
        message: "User signed in!",
    });
});

// Signup route
router.post("/signup", upload.single('profilePicture'), async (req, res) => {
    let body = req.body;
    console.log(req.body);
    
    let profilePicture;
    if (req.file) {
        console.log("File uploaded!");
        profilePicture = req.file.buffer.toString('base64');
    } else {
        console.log('No file uploaded');
    }

    try {
        let pswd = await passwords.hash(body.password);

        let user = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: pswd,
            role: body.role,
            avatar: profilePicture,
        });

        console.log(user);
        return res.status(201).json({ message: "Account created! You can now sign in!" });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) return res.status(400).json({ message: error.errors[Object.keys(error.errors)[0]].message });
        else if (error.name === 'MongoServerError' && error.code === 11000) return res.status(409).json({message: 'Email already exists'});
        else {
            console.error(error);
            return res.status(500).json({message: 'Internal server error. Please contact the administrator.'});
        }
    }
});

module.exports = router;