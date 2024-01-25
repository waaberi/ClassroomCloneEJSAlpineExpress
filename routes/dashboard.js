// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

// Route pour obtenir les informations de l'utilisateur
router.get("/info", APIAuth, async (req, res) => {
  try {
    // Recherche de l'utilisateur par email
    const user = await req.db.user_table.findOne("email", req.user_email);
    // Si l'utilisateur n'existe pas, retourne une erreur 404
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas!" });
    }
    // Retourne les informations de l'utilisateur
    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (err) {
    // En cas d'erreur, retourne une erreur 500
    return res.status(500).json({ message: "Une erreur inattendue s'est produite!" });
  }
});

// Route pour supprimer l'utilisateur
router.delete("/delete", APIAuth, async (req, res) => {
  try {
    // Supprime l'utilisateur par email
    await req.db.user_table.deleteOne("email", req.user_email);
    // Supprime le cookie "token"
    res.clearCookie("token");
    // Retourne un message de succès
    return res.status(200).json({
        message: "User updated with success!",
    });
  } catch (err) {
    // En cas d'erreur, retourne une erreur 500
    return res.status(500).json({ message: "An unexpected error occured." });
  }
});

// Route pour mettre à jour l'utilisateur
router.put("/update", APIAuth, async (req, res) => {
  try {
    // Met à jour l'utilisateur par email
    await req.db.user_table.updateOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }, "email", req.user_email);

    // Retourne un message de succès
    res.send("User updated with success!");
  } catch (err) {
    // En cas d'erreur, affiche l'erreur et retourne une erreur 500
    console.error(err);
    res.status(500).send("An unexpected error occured.");
  }
});

// Route pour la page de tableau de bord
router.get('/', ClientAuth, (req, res) => {
  return res.render('dashboard');
});

// Exportation du routeur
module.exports = router;