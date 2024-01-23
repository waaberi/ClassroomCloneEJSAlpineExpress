const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

module.exports = mongoose.model("Assignment", assignmentSchema);