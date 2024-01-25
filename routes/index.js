// Importation des modules nécessaires
const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

// Données de test pour les cours
const data = [
  // Chaque objet représente un cours
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  // ... autres cours
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
];

// Route pour obtenir les données des cours
router.get("/data", APIAuth, (req, res) => {
  // Retourne les données des cours en format JSON
  return res.json(data);
});

// Route pour la page d'accueil
router.get('/', ClientAuth, (req, res) => {
  // Rendu de la page d'accueil
  return res.render('index');
});

// Exportation du routeur
module.exports = router;