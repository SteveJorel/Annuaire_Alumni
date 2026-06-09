/**
 * Middleware de gestion centralisée des erreurs
 * Intercepte toutes les erreurs transmises via next(error)
 */
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Erreur : ${err.message}`);

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erreur de validation.",
      errors: messages,
    });
  }

  // Erreur de cast Mongoose (ex: ID invalide)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Donnée invalide fournie.",
    });
  }

  // Erreur générique 500
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erreur interne du serveur.",
  });
};

module.exports = errorHandler;
