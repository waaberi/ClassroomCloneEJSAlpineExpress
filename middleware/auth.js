const jwt = require("jsonwebtoken");

module.exports = {
    // Middleware pour authentifier les requêtes API
    APIAuth: function (req, res, next) {
        try {
            // Vérifie le token JWT et décode les informations de l'utilisateur
            const decoded = jwt.verify(req.cookies.token, process.env.NODE_ENV == "production" ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV);
            // Stocke l'email de l'utilisateur dans la requête
            req.user_id = decoded.user_id;
            // Passe au prochain middleware
            next();
        } catch (error) {
            // En cas d'erreur (par exemple, un token invalide), renvoie une erreur 401
            console.error(error);
            res.status(401).json({ message: "Invalid token" });
        }
    },
    // Middleware pour authentifier les clients
    ClientAuth: function (req, res, next) {
        try {
            // Vérifie le token JWT et décode les informations de l'utilisateur
            const decoded = jwt.verify(req.cookies.token, process.env.NODE_ENV == "production" ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV);
            // Stocke l'email de l'utilisateur dans la requête
            req.user_id = decoded.user_id;
            // Passe au prochain middleware
            next();
        } catch (error) {
            // En cas d'erreur (par exemple, un token invalide), redirige vers la page d'authentification
            console.error(error)
            res.redirect("/auth");
        }
    },
    // Middleware pour gérer les clients non authentifiés
    ClientNoAuth: function (req, res, next) {
        try {
            // Vérifie le token JWT
            const decoded = jwt.verify(req.cookies.token, process.env.NODE_ENV == "production" ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV);
            // Si le token est valide, redirige vers la page d'accueil
            res.redirect("/");
        } catch (error) {
            // Si le token est invalide, supprime le cookie et passe au prochain middleware
            if (req.cookies.token) res.clearCookie("token");
            console.error(error)
            next();
        }
    }
};