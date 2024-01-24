const mongoose = require("mongoose");
const User = require("../models/user");
const fetchFurther = require("../utils/fetchFurther");
require("dotenv").config();

mongoose.connect(process.env.DB_LINK || process.env.DB_LINK_DEV);

mongoose.connection.on("connected", async () => {
    try {
        // get list of all IDs in User
        let users = await User.find().select("_id");
        let results = await fetchFurther("User", users.map((user) => user._id), ["firstName", "lastName", "email"]);
        console.log(results);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            console.log(error.errors[Object.keys(error.errors)[0]].message);
        } else if (error.name === 'MongoServerError' && error.code === 11000) {
            console.log('Email already exists');
        } else {
            console.error(error);
        }
    }
});
mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
});