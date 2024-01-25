const express = require("express");
const multer = require('multer');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ClientNoAuth } = require("../middleware/auth");
const bcrypt = require('bcrypt');

const upload = multer({ storage: multer.memoryStorage() });

// Authentication page
router.get("/", ClientNoAuth, (req, res) => res.render("auth"));

// Login route
router.post("/signin", upload.none(), async (req, res) => {
    let body = req.body;

    try {
        const user = await req.db.user_table.findOne("email", body.email);
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist!" });
        }

        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) return res.status(403).json({ message: "Incorrect password!" });

        let token = jwt.sign(
            { user_email: user.email },
            process.env.NODE_ENV == "production" ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV
        );
    
        res.cookie("token", token); // Set the "token" cookie

        return res.status(200).send({
            message: "User signed in!",
        });
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "An unexpected error occured!" });
    }
});

// Signup route
router.post("/signup", upload.single('profilePicture'), async (req, res) => {
    let body = req.body;
    
    let message = "empty", status_code = 500;

    let validation = req.db.user_table.validate(body);

    if (validation) {
        status_code = 400;
        message = validation;
        return res.status(status_code).json({ message });
    }

    let profilePicture;
    if (req.file) {
        console.log("File uploaded!");
        profilePicture = req.file.buffer.toString('base64');
    } else {
        console.log('No file uploaded');
    }

    try {
        let pswd = await bcrypt.hash(body.password, 10);

        let data = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: pswd,
            role: body.role,
            avatar: profilePicture,
        };

        await req.db.user_table.create(data);
        status_code = 201;
        message = "Account created! You can now sign in!";
    } catch (err) {
        message = req.db.user_table.constraintInterpreter(err.message);
        status_code = 409;
        if (message === "An unknown constraint was violated.") {
            console.error(err.message);
            status_code = 500;
        }
    }
    res.status(status_code).json({ message });
});

module.exports = router;