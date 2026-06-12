import AlumniCard from "./AlumniCard";
import React from "react";
import Spinner from "./Spinner";

const DirectoryGrid = ({ alumni = [], loading = false, error = "" }) => {

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "30px", color: "red" }}>
        {error}
      </h3>
    );
  }

  if (!alumni || alumni.length === 0) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "30px" }}>
        Aucun résultat trouvé
      </h3>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "15px",
      padding: "20px"
    }}>
      {alumni.map((item) => (
        <AlumniCard key={item._id} alumni={item} />
      ))}
    </div>
  );
};

export default DirectoryGrid;