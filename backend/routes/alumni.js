const express = require("express");
const router = express.Router();
const Alumni = require("../models/alumni");

/**
 * @route   POST /api/alumni
 * @desc    Créer un nouveau profil Alumni
 * @access  Public
 *
 * Codes de réponse :
 *   201 - Profil créé avec succès
 *   400 - Données invalides ou manquantes
 *   500 - Erreur interne du serveur
 */
router.post("/", async (req, res, next) => {
  try {
    const { fullName, graduationYear, company, jobTitle, skills, contactEmail } =
      req.body;

    // --- Validation manuelle des champs requis ---
    const missingFields = [];
    if (!fullName) missingFields.push("fullName");
    if (!graduationYear) missingFields.push("graduationYear");
    if (!company) missingFields.push("company");
    if (!jobTitle) missingFields.push("jobTitle");
    if (!contactEmail) missingFields.push("contactEmail");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Champs obligatoires manquants.",
        missingFields,
      });
    }

    // --- Validation : maximum 3 compétences ---
    if (skills && skills.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas soumettre plus de 3 compétences.",
      });
    }

    // --- Création et sauvegarde du profil ---
    const newAlumni = new Alumni({
      fullName,
      graduationYear,
      company,
      jobTitle,
      skills: skills || [],
      contactEmail,
    });

    const savedAlumni = await newAlumni.save();

    return res.status(201).json({
      success: true,
      message: "Profil Alumni créé avec succès.",
      data: savedAlumni,
    });
  } catch (error) {
    // Erreurs de validation Mongoose (email invalide, contrainte skills, etc.)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation.",
        errors: messages,
      });
    }
    next(error); // Transmis au middleware errorHandler
  }
});

/**
 * @route   GET /api/alumni
 * @desc    Lister tous les profils avec filtres optionnels via req.query
 * @access  Public
 *
 * Query strings supportés :
 *   ?search=Yves             → Recherche textuelle insensible à la casse sur fullName
 *   ?promo=2021              → Filtrage par année de promotion
 *   ?search=jean&promo=2024  → Combinaison des deux filtres simultanément
 *
 * Codes de réponse :
 *   200 - Succès
 *   500 - Erreur interne du serveur
 */
router.get("/", async (req, res, next) => {
  try {
    const { search, promo } = req.query;

    // Construction dynamique du filtre MongoDB
    const filter = {};

    // Filtre 1 : Recherche textuelle insensible à la casse sur fullName
    if (search && search.trim() !== "") {
      filter.fullName = {
        $regex: search.trim(),
        $options: "i", // insensible à la casse
      };
    }

    // Filtre 2 : Filtrage par année de promotion
    if (promo) {
      const promoYear = parseInt(promo, 10);
      if (!isNaN(promoYear)) {
        filter.graduationYear = promoYear;
      }
    }

    // Combinaison des deux filtres simultanément (search + promo)
    const alumni = await Alumni.find(filter);

    return res.status(200).json(alumni);
  } catch (error) {
    next(error); // Transmis au middleware errorHandler
  }
});

module.exports = router;