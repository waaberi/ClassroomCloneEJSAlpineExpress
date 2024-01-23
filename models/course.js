const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        validate: {
            validator: function(value) {
                const linkRegex = /^(http|https):\/\/[^ "]+$/;
                return linkRegex.test(value);
            },
            message: "Invalid link format",
        },
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    visibility: {
        type: String,
        enum: ["public", "private"],
        default: "private",
    },
    entry: {
        type: String,
        enum: ["open", "closed"],
        default: "closed",
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    requests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    announcements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Announcement",
        },
    ],
    assignments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
        },
    ]
});

module.exports = mongoose.model("Course", courseSchema);