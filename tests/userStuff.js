const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

mongoose.connect(process.env.DB_LINK || process.env.DB_LINK_DEV);

mongoose.connection.on("connected", async () => {
    try {
        const newUser = await User.create({
            firstName: "John",
            lastName: "Doe",
            email: "testemail1234@gmail.com",
            password: "fdgdfdfsdfsdfsd",
            role: "student1",
        });

        console.log(newUser);
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