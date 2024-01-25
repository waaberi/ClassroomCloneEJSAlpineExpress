// Importation des modules nécessaires
const express = require("express");
const multer = require('multer');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ClientNoAuth } = require("../middleware/auth");
const bcrypt = require('bcrypt');

// Configuration de multer pour le stockage en mémoire
const upload = multer({ storage: multer.memoryStorage() });

// Route pour la page d'authentification
router.get("/", ClientNoAuth, (req, res) => res.render("auth"));

// Route pour la connexion
router.post("/signin", upload.none(), async (req, res) => {
    let body = req.body;

    try {
        // Recherche de l'utilisateur par email
        const user = await req.db.user_table.findOne("email", body.email);
        // Si l'utilisateur n'existe pas, retourne une erreur 404
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist!" });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(body.password, user.password);
        // Si le mot de passe est incorrect, retourne une erreur 403
        if (!isMatch) return res.status(403).json({ message: "Incorrect password!" });

        // Génération du token JWT
        let token = jwt.sign(
            { user_email: user.email },
            process.env.NODE_ENV == "production" ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV
        );
    
        // Définition du cookie "token"
        res.cookie("token", token);

        // Retourne un message de succès
        return res.status(200).send({
            message: "User signed in!",
        });
    } catch (err) {
        // En cas d'erreur, affiche l'erreur et retourne une erreur 500
        console.error(err.message)
        res.status(500).json({ message: "An unexpected error occured!" });
    }
});

// Route pour l'inscription
router.post("/signup", upload.single('profilePicture'), async (req, res) => {
    let body = req.body;
    
    let message = "empty", status_code = 500;

    // Validation des données de l'utilisateur
    let validation = req.db.user_table.validate(body);

    // Si la validation échoue, retourne une erreur 400
    if (validation) {
        status_code = 400;
        message = validation;
        return res.status(status_code).json({ message });
    }

    let profilePicture;
    // Si un fichier a été téléchargé, le convertit en base64
    if (req.file) {
        console.log("File uploaded!");
        profilePicture = req.file.buffer.toString('base64');
    } else {
        console.log('No file uploaded');
    }

    try {
        // Hachage du mot de passe
        let pswd = await bcrypt.hash(body.password, 10);

        // Préparation des données de l'utilisateur
        let data = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: pswd,
            role: body.role,
            avatar: profilePicture,
        };

        // Création de l'utilisateur
        await req.db.user_table.create(data);
        status_code = 201;
        message = "Account created! You can now sign in!";
    } catch (err) {
        // Interprétation des contraintes en cas d'erreur
        message = req.db.user_table.constraintInterpreter(err.message);
        status_code = 409;
        if (message === "An unknown constraint was violated.") {
            console.error(err.message);
            status_code = 500;
        }
    }
    // Retourne le message et le code de statut
    res.status(status_code).json({ message });
});

// Exportation du routeur
module.exports = router;