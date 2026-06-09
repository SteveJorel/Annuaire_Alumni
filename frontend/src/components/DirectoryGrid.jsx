// components/DirectoryGrid.jsx
// Grille d'affichage de toutes les cartes Alumni

import AlumniCard from './AlumniCard';
import Spinner from './Spinner';
import styles from './DirectoryGrid.module.css';

/**
 * @param {Object}   props
 * @param {Array}    props.alumni   — tableau de profils depuis l'API
 * @param {boolean}  props.loading  — true pendant le fetch
 * @param {string}   props.error    — message d'erreur éventuel
 */
function DirectoryGrid({ alumni, loading, error }) {
  return (
    <main className={styles.wrapper}>
      <div className={styles.grid}>

        {/* ── Chargement ── */}
        {loading && <Spinner />}

        {/* ── Erreur réseau ── */}
        {!loading && error && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⚠</span>
            <h2 className={styles.emptyTitle}>Erreur de connexion</h2>
            <p className={styles.emptyText}>{error}</p>
          </div>
        )}

        {/* ── Aucun résultat ── */}
        {!loading && !error && alumni.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <h2 className={styles.emptyTitle}>Aucun résultat trouvé</h2>
            <p className={styles.emptyText}>
              Essayez un autre nom ou une autre année de promotion.
            </p>
          </div>
        )}

        {/* ── Liste des cartes ── */}
        {!loading && !error && alumni.map((alumnus, index) => (
          <AlumniCard
            key={alumnus._id}
            alumni={alumnus}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}

      </div>
    </main>
  );
}

export default DirectoryGrid;
