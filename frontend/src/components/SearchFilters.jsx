// components/SearchFilters.jsx
// Barre de recherche textuelle + menu déroulant de l'année de promotion

import styles from './SearchFilters.module.css';

// Plage d'années de promotion disponibles dans le menu déroulant
// À ajuster selon l'historique réel de l'ENSPM Génie Informatique
const PROMO_YEARS = Array.from(
  { length: new Date().getFullYear() - 2014 },
  (_, i) => 2015 + i
).reverse(); // Du plus récent au plus ancien

/**
 * @param {Object}   props
 * @param {string}   props.searchTerm       — valeur de la barre de recherche (état dans App)
 * @param {Function} props.onSearchChange   — setter du searchTerm
 * @param {string}   props.promoFilter      — année sélectionnée (état dans App)
 * @param {Function} props.onPromoChange    — setter du promoFilter
 * @param {number}   props.resultsCount     — nombre de résultats affichés
 * @param {boolean}  props.loading          — true pendant le fetch
 */
function SearchFilters({
  searchTerm,
  onSearchChange,
  promoFilter,
  onPromoChange,
  resultsCount,
  loading,
}) {
  const hasFilters = searchTerm.trim() !== '' || promoFilter !== '';

  const handleReset = () => {
    onSearchChange('');
    onPromoChange('');
  };

  return (
    <section className={styles.wrapper} aria-label="Filtres de recherche">

      {/* ── Titre ── */}
      <h1 className={styles.heading}>
        Réseau des <span className={styles.headingAccent}>Alumni</span>
      </h1>
      <p className={styles.subtext}>
        Retrouvez et connectez-vous avec les anciens du département de Génie Informatique
      </p>

      {/* ── Filtres ── */}
      <div className={styles.filters}>

        {/* Recherche par nom */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Rechercher un alumni par nom…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Rechercher un alumni par nom"
            autoComplete="off"
          />
        </div>

        {/* Filtre par année de promotion */}
        <div className={styles.selectWrapper}>
          <select
            className={styles.promoSelect}
            value={promoFilter}
            onChange={(e) => onPromoChange(e.target.value)}
            aria-label="Filtrer par année de promotion"
          >
            <option value="">Toutes les promotions</option>
            {PROMO_YEARS.map((year) => (
              <option key={year} value={year}>
                Promo {year}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow} aria-hidden="true">▾</span>
        </div>

        {/* Bouton reset — affiché uniquement si un filtre est actif */}
        {hasFilters && (
          <button
            className={styles.resetBtn}
            onClick={handleReset}
            aria-label="Réinitialiser les filtres"
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* ── Compteur de résultats ── */}
      <div className={styles.resultsInfo} aria-live="polite" aria-atomic="true">
        {loading ? (
          <span>Recherche en cours…</span>
        ) : (
          <>
            <span className={styles.count}>{resultsCount}</span>
            <span>
              {resultsCount === 0
                ? 'alumni trouvé'
                : resultsCount === 1
                ? 'alumni trouvé'
                : 'alumni trouvés'}
              {hasFilters && ' · filtres actifs'}
            </span>
          </>
        )}
      </div>

      <div className={styles.divider} />
    </section>
  );
}

export default SearchFilters;
