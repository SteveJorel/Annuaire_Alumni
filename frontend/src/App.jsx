import { useState, useEffect } from 'react';

import Header         from './components/Header';
import SearchFilters  from './components/SearchFilters';
import DirectoryGrid  from './components/DirectoryGrid';
import RegisterForm   from './components/RegisterForm';

import useDebounce         from './hooks/useDebounce';
import { fetchAlumni }     from './services/alumniService';

import './styles/global.css';

function App() {
  const [searchTerm,  setSearchTerm]  = useState('');
  const [promoFilter, setPromoFilter] = useState('');

  const debouncedSearch = useDebounce(searchTerm,  500);
  const debouncedPromo  = useDebounce(promoFilter, 300);

  const [alumni,  setAlumni]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    let cancelled = false;

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

    return () => { cancelled = true; };

  }, [debouncedSearch, debouncedPromo]);

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setSearchTerm('');
    setPromoFilter('');
  };

  // Supprime une carte de l'affichage sans toucher la base de données
  const handleDelete = (id) => {
    setAlumni((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <>
      <Header onRegisterClick={() => setShowRegister(true)} />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        promoFilter={promoFilter}
        onPromoChange={setPromoFilter}
        resultsCount={alumni.length}
        loading={loading}
      />

      <DirectoryGrid
        alumni={alumni}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />

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