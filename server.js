require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const alumniRoutes = require("./routes/alumni");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --- Middlewares globaux ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/alumni", alumniRoutes);

// --- Middleware de gestion centralisée des erreurs ---
app.use(errorHandler);

// --- Connexion MongoDB + démarrage du serveur ---
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB.");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });
