const mongoose = require("mongoose");

/**
 * Modèle Mongoose - Alumni
 * Champs requis : fullName, graduationYear, company, jobTitle, skills, contactEmail
 * Contraintes   : fullName indexé, skills maximum 3 éléments
 */
const alumniSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Le nom complet est obligatoire."],
    trim: true,
    index: true, // Indexé pour optimiser la recherche textuelle
  },

  graduationYear: {
    type: Number,
    required: [true, "L'année de promotion est obligatoire."],
  },

  company: {
    type: String,
    required: [true, "L'entreprise actuelle est obligatoire."],
    trim: true,
  },

  jobTitle: {
    type: String,
    required: [true, "L'intitulé du poste est obligatoire."],
    trim: true,
  },

  skills: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 3;
      },
      message: "Vous ne pouvez pas avoir plus de 3 compétences.",
    },
    default: [],
  },

  contactEmail: {
    type: String,
    required: [true, "L'adresse email de contact est obligatoire."],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Veuillez fournir une adresse email valide."],
  },
});

module.exports = mongoose.model("Alumni", alumniSchema);
