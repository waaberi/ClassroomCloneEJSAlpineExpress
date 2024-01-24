const User = require('../models/user');
const Submission = require('../models/submission');
const Assignment = require('../models/assignment');
const Course = require('../models/course');
const Announcement = require('../models/announcement');

const table = { User, Submission, Assignment, Course, Announcement };

module.exports = async (name, arr, fields=["firstName", "lastName"]) => { // fetches the given fields for every id in the list
    if (!table[name]) throw new Error("Invalid table name");
    return new Promise(async (resolve, reject) => {
        try {
            let data = await table[name].find({ _id: { $in: arr } }).select(fields.join(" "));
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}