// components/AlumniCard.jsx
// Carte individuelle d'un profil Alumni
// NOTE : Ce composant est la responsabilité du Membre 4 (UI & Design).
// Cette version est un placeholder fonctionnel pour que l'App tourne.

import styles from './AlumniCard.module.css';

/**
 * @param {Object} props
 * @param {Object} props.alumni — profil alumni depuis l'API
 */
function AlumniCard({ alumni }) {
  const { fullName, graduationYear, company, jobTitle, skills, contactEmail } = alumni;

  // Initiales pour l'avatar par défaut
  const initials = fullName
    .trim()
    .split(' ')
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

  return (
    <article className={styles.card}>
      {/* Avatar par défaut avec initiales */}
      <div className={styles.avatar} aria-hidden="true">
        {initials}
      </div>

      {/* Infos principales */}
      <div>
        <h3 className={styles.name}>{fullName.trim()}</h3>
        <p className={styles.meta}>{jobTitle} · {company}</p>
      </div>

      {/* Badge promotion */}
      <span className={styles.promo}>Promo {graduationYear}</span>

      {/* Pastilles compétences */}
      {skills?.length > 0 && (
        <div className={styles.skills} aria-label="Compétences">
          {skills.map((skill) => (
            <span key={skill} className={styles.skill}>
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Liens contact */}
      <div className={styles.links}>
        <a
          href={`mailto:${contactEmail}`}
          className={styles.link}
          aria-label={`Envoyer un email à ${fullName}`}
        >
          ✉ Email
        </a>
      </div>
    </article>
  );
}

export default AlumniCard;
