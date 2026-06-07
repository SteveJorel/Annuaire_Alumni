import { useState, useCallback } from "react";

// ── constantes ────────────────────────────────────────────────────────────────
const MAX_SKILLS = 3;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 31 }, (_, i) => CURRENT_YEAR - i);

const INITIAL_FORM = {
  nom: "",
  annee: "",
  email: "",
  entreprise: "",
  poste: "",
};

// ── règles de validation ──────────────────────────────────────────────────────
const VALIDATORS = {
  nom: (v) => {
    if (!v.trim()) return "Le nom est requis.";
    if (v.trim().length < 2) return "Le nom doit contenir au moins 2 caractères.";
    if (v.trim().length > 60) return "Nom trop long (60 caractères maximum).";
    return "";
  },
  annee: (v) => (!v ? "Veuillez sélectionner votre année de promotion." : ""),
  email: (v) => {
    if (!v.trim()) return "L'adresse e-mail est requise.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Format invalide — ex : nom@domaine.com";
    return "";
  },
  entreprise: (v) =>
    v.trim().length < 2 ? "Veuillez indiquer votre entreprise ou organisation." : "",
  poste: (v) =>
    v.trim().length < 2 ? "Veuillez indiquer votre poste actuel." : "",
};

// ── sous-composants ───────────────────────────────────────────────────────────

function Field({ id, label, required, error, touched, children }) {
  return (
    <div className="rf-field">
      <label htmlFor={id} className="rf-label">
        {label}
        {required && <span className="rf-req" aria-hidden="true"> *</span>}
      </label>
      {children}
      {touched && error && (
        <p className="rf-error" role="alert" aria-live="polite">
          <span className="rf-error-icon" aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

function SkillBadge({ skill, onRemove }) {
  return (
    <span className="rf-badge">
      {skill}
      <button
        type="button"
        onClick={onRemove}
        className="rf-badge-remove"
        aria-label={`Supprimer la compétence ${skill}`}
      >
        ×
      </button>
    </span>
  );
}

function SuccessCard({ data, onReset }) {
  const rows = [
    { k: "Nom", v: data.nom },
    { k: "Promotion", v: data.annee },
    { k: "Email", v: data.email },
    { k: "Entreprise", v: data.entreprise },
    { k: "Poste", v: data.poste },
    { k: "Compétences", v: data.competences.join(", ") || "—" },
  ];

  return (
    <div className="rf-success" role="status" aria-live="polite">
      <div className="rf-success-icon" aria-hidden="true">✓</div>
      <h2 className="rf-success-title">Profil enregistré avec succès !</h2>
      <p className="rf-success-sub">
        Bienvenue dans le réseau alumni ENSPM. Vos données ont bien été transmises.
      </p>
      <dl className="rf-summary">
        {rows.map(({ k, v }) => (
          <div key={k} className="rf-summary-item">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <button type="button" className="rf-reset-btn" onClick={onReset}>
        ↺ Inscrire un autre profil
      </button>
    </div>
  );
}

// ── composant principal ───────────────────────────────────────────────────────

export default function RegisterForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [globalError, setGlobalError] = useState("");

  // ── calcul erreurs + progression ──
  const errors = Object.fromEntries(
    Object.entries(VALIDATORS).map(([k, fn]) => [k, fn(form[k])])
  );
  const fieldCount = Object.keys(VALIDATORS).length + 1; // +1 pour compétences
  const doneCount =
    Object.entries(errors).filter(([, e]) => !e).length + (skills.length > 0 ? 1 : 0);
  const progress = Math.round((doneCount / fieldCount) * 100);

  // ── handlers ──
  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    setTouched((prev) => ({ ...prev, [e.target.id]: true }));
  }, []);

  const addSkill = useCallback(() => {
    const val = skillInput.trim();
    if (!val || skills.length >= MAX_SKILLS) return;
    if (skills.includes(val)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, val]);
    setSkillInput("");
    setSkillsError("");
  }, [skillInput, skills]);

  const removeSkill = useCallback((idx) => {
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSkillKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    },
    [addSkill]
  );

  // ── soumission ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    // Marquer tous les champs comme touchés
    const allTouched = Object.fromEntries(Object.keys(VALIDATORS).map((k) => [k, true]));
    setTouched(allTouched);

    // Valider
    const hasFieldErrors = Object.values(errors).some(Boolean);
    const hasSkillError = skills.length === 0;
    if (hasSkillError) setSkillsError("Ajoutez au moins une compétence.");

    if (hasFieldErrors || hasSkillError) return;

    const payload = {
      nom: form.nom.trim(),
      annee: parseInt(form.annee, 10),
      email: form.email.trim(),
      entreprise: form.entreprise.trim(),
      poste: form.poste.trim(),
      competences: skills,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Erreur serveur (${res.status})`);
      }

      setSubmittedData(payload);
      setSubmitted(true);
    } catch (err) {
      setGlobalError(
        err.message.includes("fetch")
          ? "Impossible de joindre le serveur. Vérifiez votre connexion."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setTouched({});
    setSkills([]);
    setSkillInput("");
    setSkillsError("");
    setSubmitted(false);
    setSubmittedData(null);
    setGlobalError("");
  };

  // ── rendu succès ──
  if (submitted) {
    return <SuccessCard data={submittedData} onReset={handleReset} />;
  }

  // ── rendu formulaire ──
  return (
    <div className="rf-wrapper">
      <style>{RF_STYLES}</style>

      <div className="rf-hero">
        <div className="rf-hero-icon" aria-hidden="true">🎓</div>
        <div>
          <h1 className="rf-title">Rejoindre le réseau alumni</h1>
          <p className="rf-subtitle">ENSPM · Génie Informatique</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="rf-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progression du formulaire">
        <div className="rf-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="rf-progress-label">{progress}% complété</p>

      <form onSubmit={handleSubmit} noValidate aria-label="Formulaire d'inscription alumni">

        {/* Section 1 — Informations personnelles */}
        <section className="rf-section" aria-labelledby="sec-personal">
          <h2 id="sec-personal" className="rf-section-title">
            👤 Informations personnelles
          </h2>

          <div className="rf-row">
            <Field id="nom" label="Nom complet" required error={errors.nom} touched={touched.nom}>
              <input
                id="nom"
                type="text"
                value={form.nom}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ex : Mouctar Saïdou"
                autoComplete="name"
                className={`rf-input ${touched.nom ? (errors.nom ? "rf-input--err" : "rf-input--ok") : ""}`}
                aria-required="true"
                aria-invalid={touched.nom && !!errors.nom}
                aria-describedby={touched.nom && errors.nom ? "nom-err" : undefined}
              />
            </Field>

            <Field id="annee" label="Année de promotion" required error={errors.annee} touched={touched.annee}>
              <select
                id="annee"
                value={form.annee}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`rf-input rf-select ${touched.annee ? (errors.annee ? "rf-input--err" : "rf-input--ok") : ""}`}
                aria-required="true"
                aria-invalid={touched.annee && !!errors.annee}
              >
                <option value="">— Sélectionner —</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field id="email" label="Adresse e-mail" required error={errors.email} touched={touched.email}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="prenom.nom@example.com"
              autoComplete="email"
              className={`rf-input ${touched.email ? (errors.email ? "rf-input--err" : "rf-input--ok") : ""}`}
              aria-required="true"
              aria-invalid={touched.email && !!errors.email}
            />
          </Field>
        </section>

        {/* Section 2 — Situation professionnelle */}
        <section className="rf-section" aria-labelledby="sec-pro">
          <h2 id="sec-pro" className="rf-section-title">
            💼 Situation professionnelle
          </h2>

          <Field id="entreprise" label="Entreprise / Organisation" required error={errors.entreprise} touched={touched.entreprise}>
            <input
              id="entreprise"
              type="text"
              value={form.entreprise}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex : Orange Cameroun, CAMTEL, Freelance…"
              className={`rf-input ${touched.entreprise ? (errors.entreprise ? "rf-input--err" : "rf-input--ok") : ""}`}
              aria-required="true"
              aria-invalid={touched.entreprise && !!errors.entreprise}
            />
          </Field>

          <Field id="poste" label="Poste occupé" required error={errors.poste} touched={touched.poste}>
            <input
              id="poste"
              type="text"
              value={form.poste}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ex : Développeur Full-Stack, Chef de projet…"
              className={`rf-input ${touched.poste ? (errors.poste ? "rf-input--err" : "rf-input--ok") : ""}`}
              aria-required="true"
              aria-invalid={touched.poste && !!errors.poste}
            />
          </Field>
        </section>

        {/* Section 3 — Compétences */}
        <section className="rf-section" aria-labelledby="sec-skills">
          <h2 id="sec-skills" className="rf-section-title">
            🏅 Compétences{" "}
            <span className="rf-section-note">(3 maximum)</span>
          </h2>

          <div className="rf-skill-row">
            <input
              type="text"
              id="skill-input"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Ex : React, Python, SQL…"
              maxLength={30}
              className="rf-input rf-skill-input"
              disabled={skills.length >= MAX_SKILLS}
              aria-label="Ajouter une compétence"
              aria-describedby="skill-hint"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!skillInput.trim() || skills.length >= MAX_SKILLS}
              className="rf-add-btn"
              aria-label="Ajouter la compétence"
            >
              + Ajouter
            </button>
          </div>
          <p id="skill-hint" className="rf-hint">
            Appuyez sur Entrée ou cliquez sur « Ajouter »
          </p>

          {skillsError && (
            <p className="rf-error" role="alert">
              <span aria-hidden="true">⚠</span> {skillsError}
            </p>
          )}

          <div className="rf-badges" aria-label="Compétences ajoutées" aria-live="polite">
            {skills.map((s, i) => (
              <SkillBadge key={s} skill={s} onRemove={() => removeSkill(i)} />
            ))}
          </div>
          <p className="rf-badge-count">
            <strong>{skills.length}</strong>/{MAX_SKILLS} compétence{skills.length !== 1 ? "s" : ""} ajoutée{skills.length !== 1 ? "s" : ""}
          </p>
        </section>

        {/* Erreur globale */}
        {globalError && (
          <div className="rf-global-error" role="alert" aria-live="assertive">
            ⚠ {globalError}
          </div>
        )}

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="rf-submit"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="rf-spinner" aria-hidden="true" /> Envoi en cours…
            </>
          ) : (
            "✈ Soumettre mon profil"
          )}
        </button>

        <p className="rf-api-note">
          🔒 Envoi sécurisé vers <code>POST /api/alumni</code>
        </p>
      </form>
    </div>
  );
}

// ── styles CSS-in-JS ──────────────────────────────────────────────────────────
const RF_STYLES = `
.rf-wrapper{max-width:600px;margin:0 auto;padding:1.5rem 1rem;font-family:system-ui,sans-serif}
.rf-hero{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem}
.rf-hero-icon{font-size:28px}
.rf-title{font-size:20px;font-weight:600;color:#111;margin:0}
.rf-subtitle{font-size:13px;color:#666;margin:2px 0 0}

.rf-progress-bar{height:5px;background:#e5e7eb;border-radius:3px;overflow:hidden;margin-bottom:4px}
.rf-progress-fill{height:100%;background:#1D9E75;border-radius:3px;transition:width .4s ease}
.rf-progress-label{font-size:12px;color:#888;text-align:right;margin-bottom:1.25rem}

.rf-section{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:1.25rem;margin-bottom:1rem}
.rf-section-title{font-size:14px;font-weight:600;color:#374151;margin:0 0 1rem;padding-bottom:.6rem;border-bottom:1px solid #f0f0f0}
.rf-section-note{font-size:12px;font-weight:400;color:#9ca3af}

.rf-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
@media(max-width:480px){.rf-row{grid-template-columns:1fr}}

.rf-field{display:flex;flex-direction:column;gap:5px;margin-bottom:.875rem}
.rf-field:last-child{margin-bottom:0}
.rf-label{font-size:13px;font-weight:500;color:#374151}
.rf-req{color:#ef4444}
.rf-input{padding:9px 12px;font-size:14px;border:1.5px solid #d1d5db;border-radius:8px;outline:none;transition:border-color .15s,box-shadow .15s;background:#fff;color:#111;width:100%}
.rf-input:hover{border-color:#9ca3af}
.rf-input:focus{border-color:#1D9E75;box-shadow:0 0 0 3px rgba(29,158,117,.12)}
.rf-input--err{border-color:#ef4444 !important;box-shadow:0 0 0 3px rgba(239,68,68,.1) !important}
.rf-input--ok{border-color:#22c55e}
.rf-select{cursor:pointer}

.rf-error{font-size:12px;color:#ef4444;display:flex;align-items:center;gap:4px;margin-top:2px}
.rf-error-icon{font-size:14px}
.rf-hint{font-size:12px;color:#9ca3af;margin-top:4px}

.rf-skill-row{display:flex;gap:8px}
.rf-skill-input{flex:1}
.rf-add-btn{padding:9px 16px;background:#ecfdf5;border:1.5px solid #1D9E75;border-radius:8px;color:#085041;font-size:13px;font-weight:500;cursor:pointer;transition:background .15s;white-space:nowrap}
.rf-add-btn:hover:not(:disabled){background:#1D9E75;color:#fff}
.rf-add-btn:disabled{opacity:.4;cursor:not-allowed}

.rf-badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;min-height:28px}
.rf-badge{display:inline-flex;align-items:center;gap:6px;background:#ecfdf5;color:#065f46;font-size:13px;font-weight:500;padding:4px 10px;border-radius:20px;border:1px solid #6ee7b7;animation:popIn .2s ease}
@keyframes popIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
.rf-badge-remove{background:none;border:none;cursor:pointer;color:#059669;font-size:16px;line-height:1;padding:0}
.rf-badge-remove:hover{color:#ef4444}
.rf-badge-count{font-size:12px;color:#6b7280;margin-top:6px}
.rf-badge-count strong{color:#1D9E75}

.rf-global-error{background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:.75rem 1rem;font-size:13px;color:#b91c1c;margin-bottom:1rem}

.rf-submit{width:100%;padding:12px;background:#1D9E75;border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s,transform .1s}
.rf-submit:hover:not(:disabled){background:#085041}
.rf-submit:active:not(:disabled){transform:scale(.98)}
.rf-submit:disabled{background:#9ca3af;cursor:not-allowed}
.rf-spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
.rf-api-note{font-size:12px;color:#9ca3af;text-align:center;margin-top:.6rem}
.rf-api-note code{font-size:11px}

/* Succès */
.rf-success{background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:2rem;text-align:center;animation:fadeUp .4s ease}
@keyframes fadeUp{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
.rf-success-icon{width:64px;height:64px;border-radius:50%;background:#dcfce7;border:2px solid #4ade80;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 1rem}
.rf-success-title{font-size:18px;font-weight:600;color:#14532d;margin-bottom:.4rem}
.rf-success-sub{font-size:14px;color:#166534;margin-bottom:1.25rem;line-height:1.5}
.rf-summary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1.25rem;text-align:left}
@media(max-width:480px){.rf-summary{grid-template-columns:1fr}}
.rf-summary-item{background:#fff;border-radius:8px;padding:8px 12px;border:1px solid #bbf7d0}
.rf-summary-item dt{font-size:11px;color:#166534;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}
.rf-summary-item dd{font-size:13px;font-weight:500;color:#14532d}
.rf-reset-btn{padding:8px 20px;border:1px solid #4ade80;border-radius:8px;background:#fff;color:#15803d;font-size:13px;cursor:pointer}
.rf-reset-btn:hover{background:#dcfce7}
`;
