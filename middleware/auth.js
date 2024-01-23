const jwt = require("jsonwebtoken");

module.exports = {
    APIAuth: function (req, res, next) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || process.env.JWT_SECRET_DEV);
            req.user_id = decoded.user_id;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Invalid token" });
        }
    },
    ClientAuth: function (req, res, next) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || process.env.JWT_SECRET_DEV);
            req.user_id = decoded.user_id;
            next();
        } catch (error) {
            console.error(error)
            res.redirect("/auth");
        }
    },
    ClientNoAuth: function (req, res, next) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || process.env.JWT_SECRET_DEV);
            res.redirect("/");
        } catch (error) {
            if (req.cookies.token) res.clearCookie("token");
            console.error(error)
            next();
        }
    }
};
