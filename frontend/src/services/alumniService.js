// services/alumniService.js
// Centralise tous les appels HTTP vers l'API back-end (Node/Express)

import axios from 'axios';

// Instance Axios configurée avec la base URL de l'API
const api = axios.create({
  baseURL: '/api',          // proxié vers http://localhost:5000/api via vite.config.js
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Récupère la liste des alumni avec filtres optionnels.
 *
 * @param {Object} params
 * @param {string} [params.search]  — recherche par nom (insensible à la casse côté serveur)
 * @param {number|string} [params.promo]   — filtre par année de promotion
 * @returns {Promise<Array>} — tableau de profils alumni
 */
export async function fetchAlumni({ search = '', promo = '' } = {}) {
  const params = {};

  // N'envoie le paramètre que s'il est renseigné (évite les query strings vides)
  if (search.trim()) params.search = search.trim();
  if (promo)         params.promo  = promo;

  const response = await api.get('/alumni', { params });
  return response.data;
}

/**
 * Crée un nouveau profil Alumni.
 *
 * @param {Object} profileData — données du formulaire d'inscription
 * @returns {Promise<Object>} — profil créé (avec _id MongoDB)
 */
export async function createAlumni(profileData) {
  const response = await api.post('/alumni', profileData);
  return response.data;
}

export default api;
