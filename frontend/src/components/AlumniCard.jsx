import React from "react";

const AlumniCard = ({ alumni }) => {
  return (
    <div style={{
      background: "#1c1c1c",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      border: "1px solid rgba(244,168,37,0.15)",
      color: "#f0ede6"
    }}>

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
      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700" }}>
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
    </div>
  );
};

export default AlumniCard;