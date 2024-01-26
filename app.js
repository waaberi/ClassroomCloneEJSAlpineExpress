// Importation des modules nécessaires
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { createClient } = require("@libsql/client");
const users_model = require("./models_sql/users");
require("dotenv").config();

// Création de l'application Express
const app = express();

// Configuration du moteur de vue
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Utilisation des middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuration de la base de données
let config;
if (process.env.NODE_ENV === "development") {
  console.log("Development environment!");
  config = {
    url: process.env.DB_LINK_DEV,
  };
} else {
  console.log("Production environment!");
  config = {
    url: process.env.DB_LINK_PROD,
    authToken: process.env.DB_PROD_KEY,
  };
}

// Création du client de base de données
const new_db = createClient(config);

// Création du modèle utilisateur
const user_table = new users_model(new_db);

// Migration de la base de données
user_table.migrate();

// Ajout de la base de données à l'objet requête
app.use(function (req, res, next) {
  req.db = { user_table };
  next();
});

// Configuration des routes
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));

// Route pour UptimeRobot
app.get("/uptimerobot", (req, res) => {
  console.log("received!");
  res.send("Received!");
});

// Gestion des erreurs 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Gestionnaire d'erreurs
app.use(function (err, req, res, next) {
  // Définition des variables locales, fournissant l'erreur uniquement en développement
  if (process.env.NODE_ENV === "development") {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // Rendu de la page d'erreur
    res.status(err.status || 500);
    res.render("error");
  } else res.status(err.status || 500).render("404");
});

// Démarrage du serveur
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
