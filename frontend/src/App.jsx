// App.jsx
// Composant racine — gestion de l'état global, filtres, fetch API
// ─────────────────────────────────────────────────────────────────
// RESPONSABILITÉ MEMBRE 3 :
//   • État global : searchTerm, promoFilter, alumni, loading, error
//   • useEffect déclenché sur les valeurs débouncées (useDebounce)
//   • Appels Axios via alumniService

import { useState, useEffect } from 'react';

import Header         from './components/Header';
import SearchFilters  from './components/SearchFilters';
import DirectoryGrid  from './components/DirectoryGrid';
import RegisterForm   from './components/RegisterForm';

import useDebounce         from './hooks/useDebounce';
import { fetchAlumni }     from './services/alumniService';

import './styles/global.css';

function App() {
  // ── États des filtres (saisis par l'utilisateur) ──────────────────
  const [searchTerm,  setSearchTerm]  = useState('');
  const [promoFilter, setPromoFilter] = useState('');

  // ── Valeurs débouncées (500ms) — déclenchent le fetch ────────────
  // Sans debounce : chaque lettre tapée = 1 requête réseau
  // Avec debounce : la requête part seulement après 500ms de pause
  const debouncedSearch = useDebounce(searchTerm,  500);
  const debouncedPromo  = useDebounce(promoFilter, 300);

  // ── État des données ──────────────────────────────────────────────
  const [alumni,  setAlumni]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // ── Modal d'inscription ───────────────────────────────────────────
  const [showRegister, setShowRegister] = useState(false);

  // ── Fetch API — se relance à chaque changement de filtre déboncé ─
  useEffect(() => {
    let cancelled = false; // évite les race conditions (requêtes en chevauchement)

    const loadAlumni = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchAlumni({
          search: debouncedSearch,
          promo:  debouncedPromo,
        });

        if (!cancelled) {
          setAlumni(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[App] Erreur fetchAlumni:', err);
          setError(
            err.code === 'ERR_NETWORK'
              ? 'Impossible de contacter le serveur. Vérifiez que le back-end est lancé sur http://localhost:5000.'
              : 'Une erreur est survenue lors du chargement des profils.'
          );
          setAlumni([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAlumni();

    // Nettoyage : ignore le résultat si le composant se démonte
    // ou si un nouveau fetch est déclenché avant la fin du précédent
    return () => { cancelled = true; };

  }, [debouncedSearch, debouncedPromo]); // ← dépendances : valeurs débouncées uniquement

  // ── Callback après inscription réussie : recharge la liste ───────
  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setSearchTerm('');
    setPromoFilter('');
    // Le useEffect ci-dessus se relancera automatiquement grâce au reset des filtres
  };

  return (
    <>
      {/* ── Barre de navigation + bouton "Rejoindre l'annuaire" ── */}
      <Header onRegisterClick={() => setShowRegister(true)} />

      {/* ── Barre de recherche + filtre promo ── */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        promoFilter={promoFilter}
        onPromoChange={setPromoFilter}
        resultsCount={alumni.length}
        loading={loading}
      />

      {/* ── Grille des cartes Alumni ── */}
      <DirectoryGrid
        alumni={alumni}
        loading={loading}
        error={error}
      />

      {/* ── Modal formulaire d'inscription (conditionnelle) ── */}
      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
}

export default App;
