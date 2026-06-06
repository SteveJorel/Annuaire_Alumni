// components/Spinner.jsx
// Indicateur de chargement — s'affiche UNIQUEMENT dans la grille de résultats

import styles from './Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Chargement en cours">
      <div className={styles.ring} aria-hidden="true">
        <div />
        <div />
        <div />
        <div />
      </div>
      <span className={styles.text}>Chargement…</span>
    </div>
  );
}

export default Spinner;
