// components/Header.jsx
// Barre de navigation principale + bouton "Rejoindre l'annuaire"

import styles from './Header.module.css';

/**
 * @param {Object} props
 * @param {Function} props.onRegisterClick — callback pour ouvrir le formulaire d'inscription
 */
function Header({ onRegisterClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* ── Logo / Brand ── */}
        <a href="/" className={styles.brand} aria-label="Accueil Annuaire Alumni ENSPM">
          <span className={styles.brandTitle}>Alumni ENSPM</span>
          <span className={styles.brandSub}>Génie Informatique · Maroua</span>
        </a>

        {/* ── CTA : Rejoindre l'annuaire ── */}
        <button
          className={styles.cta}
          onClick={onRegisterClick}
          aria-label="Rejoindre l'annuaire des Alumni"
        >
          <span className={styles.ctaIcon} aria-hidden="true">＋</span>
          <span>Rejoindre l'annuaire</span>
        </button>

      </div>
    </header>
  );
}

export default Header;
