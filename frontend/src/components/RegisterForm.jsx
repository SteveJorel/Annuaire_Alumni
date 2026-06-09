// components/RegisterForm.jsx
// Formulaire d'inscription Alumni
// NOTE : Ce composant est la responsabilité du Membre 5 (Mouctar).
// Cette version est un placeholder minimal pour que l'App compile.

import { useState } from 'react';
import { createAlumni } from '../services/alumniService';
import styles from './RegisterForm.module.css';

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
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.length >= 3 || form.skills.includes(s)) return;
    setForm({ ...form, skills: [...form.skills, s] });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSubmit = async () => {
    setError('');
    const { fullName, graduationYear, company, jobTitle, skills, contactEmail } = form;
    if (!fullName || !graduationYear || !company || !jobTitle || !contactEmail) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await createAlumni({ ...form, graduationYear: Number(graduationYear) });
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
            <label className={styles.label}>Nom complet *</label>
            <input className={styles.input} name="fullName" value={form.fullName} onChange={handleChange} placeholder="ex : Jean Yves Mana" />

            <label className={styles.label}>Année de promotion *</label>
            <input className={styles.input} name="graduationYear" type="number" value={form.graduationYear} onChange={handleChange} placeholder="ex : 2023" min="2010" max="2030" />

            <label className={styles.label}>Entreprise actuelle *</label>
            <input className={styles.input} name="company" value={form.company} onChange={handleChange} placeholder="ex : Orange Cameroun" />

            <label className={styles.label}>Intitulé du poste *</label>
            <input className={styles.input} name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="ex : Développeur Full-Stack" />

            <label className={styles.label}>Email de contact *</label>
            <input className={styles.input} name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} placeholder="ex : jean.yves@example.com" />

            <label className={styles.label}>Compétences clés (max 3)</label>
            <div className={styles.skillRow}>
              <input
                className={styles.input}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="ex : React"
                disabled={form.skills.length >= 3}
              />
              <button className={styles.addSkillBtn} onClick={addSkill} disabled={form.skills.length >= 3}>+</button>
            </div>
            <div className={styles.skillTags}>
              {form.skills.map((s) => (
                <span key={s} className={styles.tag}>
                  {s}
                  <button onClick={() => removeSkill(s)} aria-label={`Supprimer ${s}`}>✕</button>
                </span>
              ))}
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Envoi…' : 'Créer mon profil'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;
