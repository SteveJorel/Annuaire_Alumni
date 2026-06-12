const mongoose = require('mongoose');

// Modèle à compléter par Personne 2 si besoin
// Structure définie selon le cahier des charges
const alumniSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Le nom complet est requis'],
      trim: true,
      index: true,
    },
    graduationYear: {
      type: Number,
      required: [true, "L'année de promotion est requise"],
    },
    company: {
      type: String,
      required: [true, "L'entreprise actuelle est requise"],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, "L'intitulé du poste est requis"],
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: 'Maximum 3 compétences autorisées',
      },
      default: [],
    },
    contactEmail: {
      type: String,
      required: [true, "L'email de contact est requis"],
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alumni', alumniSchema);
