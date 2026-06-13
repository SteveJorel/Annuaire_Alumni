import React, { useState } from "react";

const AlumniCard = ({ alumni, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete?.(alumni._id);
  };

  return (
    <div style={{
      background: "#1c1c1c",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      border: "1px solid rgba(244,168,37,0.15)",
      color: "#f0ede6",
      position: "relative"
    }}>

      {/* Bouton suppression carte */}
      <button
        onClick={handleDelete}
        title={confirmDelete ? "Cliquer encore pour confirmer" : "Supprimer ce profil"}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: confirmDelete ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)",
          border: confirmDelete ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
          color: confirmDelete ? "#ef4444" : "#8a8478",
          borderRadius: "6px",
          width: "26px",
          height: "26px",
          fontSize: "13px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        ✕
      </button>

      {/* Avatar */}
      <div style={{
        width: "44px", height: "44px",
        borderRadius: "50%",
        background: "#f4a825",
        color: "#0d0d0d",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: "bold", fontSize: "18px",
        marginBottom: "12px"
      }}>
        {alumni.fullName?.charAt(0).toUpperCase()}
      </div>

      {/* Nom */}
      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", paddingRight: "30px" }}>
        {alumni.fullName}
      </h3>

      {/* Poste + Entreprise */}
      <p style={{ color: "#8a8478", fontSize: "14px", margin: "0 0 4px" }}>
        {alumni.jobTitle} · {alumni.company}
      </p>

      {/* Année de promotion */}
      <p style={{ color: "#f4a825", fontSize: "12px", margin: "0 0 10px", fontWeight: "600" }}>
        Promo {alumni.graduationYear}
      </p>

      {/* Badges compétences */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
        {alumni.skills?.map((skill, i) => (
          <span key={i} style={{
            background: "rgba(244,168,37,0.12)",
            color: "#f4a825",
            padding: "3px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            border: "1px solid rgba(244,168,37,0.25)"
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Lien email cliquable */}
      <a href={`mailto:${alumni.contactEmail}`} style={{
        color: "#8a8478", fontSize: "12px",
        textDecoration: "none"
      }}>
        ✉ {alumni.contactEmail}
      </a>

      {/* Message de confirmation suppression */}
      {confirmDelete && (
        <p style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "#ef4444",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "6px",
          padding: "5px 8px"
        }}>
          ⚠ Cliquer encore pour confirmer la suppression
        </p>
      )}
    </div>
  );
};

export default AlumniCard;