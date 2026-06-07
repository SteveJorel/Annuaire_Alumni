import React from "react";
const AlumniCard = ({ alumni }) => {
    
  return (
    <div style={{
      background: "#fff",
      padding: "15px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>

      {/* avatar */}
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#4f46e5",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        marginBottom: "10px"
      }}>
        {alumni.fullName?.charAt(0).toUpperCase()}
      </div>

      <h3>{alumni.fullName}</h3>

      <p style={{ color: "gray" }}>
        {alumni.jobTitle} - {alumni.company}
      </p>

      <div style={{ marginTop: "8px" }}>
        {alumni.skills?.map((skill, i) => (
          <span key={i} style={{
            display: "inline-block",
            background: "#e0e7ff",
            color: "#3730a3",
            padding: "3px 7px",
            marginRight: "5px",
            borderRadius: "6px",
            fontSize: "12px"
          }}>
            {skill}
          </span>
        ))}
      </div>

      <p style={{ fontSize: "12px", marginTop: "8px" }}>
        {alumni.contactEmail}
      </p>

    </div>
  );
};

export default AlumniCard;