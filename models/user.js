const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        validate: {
            validator: function(value) {
                const linkRegex = /^(http|https):\/\/[^ "]+$/;
                return linkRegex.test(value);
            },
            message: "Invalid link format",
        },
    },
    email: {
        type: String,
        validate: {
            validator: v => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
            message: props => `${props.value} is not a valid email address!`
        },
        required: true,
        unique: true,
    },
    password: {
        type: String,
        validate: {
            validator: v => v.length >= 8,
            message: `Minimum password length is 8 characters!`
        },
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "teacher",
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    managedCourses: [
        // only teachers can have this
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);