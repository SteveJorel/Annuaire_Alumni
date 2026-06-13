import { useState } from 'react';
import { createAlumni } from '../services/alumniService';
import styles from './RegisterForm.module.css';

// Validation email : doit respecter le format standard xxx@xxx.xx
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

function RegisterForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    graduationYear: '',
    company: '',
    jobTitle: '',
    skills: [],
    contactEmail: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validation email en temps réel
    if (name === 'contactEmail') {
      if (value && !isValidEmail(value)) {
        setEmailError('Format invalide. Ex : jean.yves@example.com');
      } else {
        setEmailError('');
      }
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (form.skills.length >= 3) return;
    if (form.skills.includes(s)) {
      setSkillInput('');
      return;
    }
    setForm({ ...form, skills: [...form.skills, s] });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async () => {
    setError('');

    const { fullName, graduationYear, company, jobTitle, contactEmail } = form;

    // Vérification champs obligatoires
    if (!fullName || !graduationYear || !company || !jobTitle || !contactEmail) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Vérification format email
    if (!isValidEmail(contactEmail)) {
      setError('L\'adresse email est invalide. Ex : jean.yves@example.com');
      return;
    }

    // Vérification année
    const year = Number(graduationYear);
    if (isNaN(year) || year < 2010 || year > 2030) {
      setError('L\'année de promotion doit être entre 2010 et 2030.');
      return;
    }

    setLoading(true);
    try {
      await createAlumni({ ...form, graduationYear: year });
      setSuccess(true);
      setTimeout(() => { onSuccess?.(); onClose?.(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Fermer">✕</button>
        <h2 className={styles.title}>Rejoindre l'annuaire</h2>

        {success ? (
          <p className={styles.successMsg}>✅ Profil créé avec succès !</p>
        ) : (
          <div className={styles.form}>

            <label className={styles.label}>NOM COMPLET *</label>
            <input className={styles.input} name="fullName" value={form.fullName} onChange={handleChange} placeholder="ex : Jean Yves Mana" />

            <label className={styles.label}>ANNÉE DE PROMOTION *</label>
            <input className={styles.input} name="graduationYear" type="number" value={form.graduationYear} onChange={handleChange} placeholder="ex : 2023" min="2010" max="2030" />

            <label className={styles.label}>ENTREPRISE ACTUELLE *</label>
            <input className={styles.input} name="company" value={form.company} onChange={handleChange} placeholder="ex : Orange Cameroun" />

            <label className={styles.label}>INTITULÉ DU POSTE *</label>
            <input className={styles.input} name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="ex : Développeur Full-Stack" />

            <label className={styles.label}>EMAIL DE CONTACT *</label>
            <input
              className={styles.input}
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="ex : jean.yves@example.com"
              style={{ borderColor: emailError ? '#ef4444' : '' }}
            />
            {emailError && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '-8px', marginBottom: '8px' }}>
                ⚠ {emailError}
              </p>
            )}

            <label className={styles.label}>COMPÉTENCES CLÉS (MAX 3)</label>
            <div className={styles.skillRow}>
              <input
                className={styles.input}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="ex : React"
                disabled={form.skills.length >= 3}
              />
              <button
                className={styles.addSkillBtn}
                onClick={addSkill}
                disabled={form.skills.length >= 3}
              >
                +
              </button>
            </div>

            {/* Badges compétences avec bouton ✕ */}
            <div className={styles.skillTags}>
              {form.skills.map((s) => (
                <span key={s} className={styles.tag}>
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    aria-label={`Supprimer ${s}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      marginLeft: '6px',
                      fontSize: '12px',
                      padding: '0',
                      lineHeight: '1'
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading || !!emailError}
            >
              {loading ? 'Envoi…' : 'Créer mon profil'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;